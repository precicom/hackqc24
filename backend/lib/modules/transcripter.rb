module Transcripter
  class YouTubeTranscripter
    def self.fetch_transcript(video_id, languages = ['fr', 'en'])
      transcript_list = TranscriptListFetcher.new.fetch(video_id)
      transcript = transcript_list.find_transcript(languages)
      transcript.fetch
    end
  end

  class TranscriptListFetcher
    WATCH_URL = 'https://www.youtube.com/watch?v=%{video_id}'

    def fetch(video_id)
      TranscriptList.build(
        video_id,
        extract_captions_json(fetch_video_html(video_id), video_id),
      )
    end

    private

    def extract_captions_json(html, video_id)
      # Split the HTML and parse the relevant JSON portion.
      captions_json = JSON.parse(html.split('"captions":').last.split(',"videoDetails')[0].tr("\n", ''))
      captions = captions_json.dig('playerCaptionsTracklistRenderer')
      raise TranscriptsDisabled, video_id unless captions

      if captions['captionTracks'].empty?
        raise NoTranscriptAvailable, video_id
      end

      captions
    end

    def fetch_video_html(video_id)
      uri = URI.parse(WATCH_URL % { video_id: video_id })
      response = HTTParty.get(uri)
      html = response.body

      if html.include?('action="https://consent.youtube.com/s"')
        match = html.match(/name="v" value="(.*?)"/)
        response = HTTParty.get(uri, {cookies: {"CONSENT" => "YES+#{match[1]}"}})
        html = response.body
        raise StandardError, "Cannot create consent cookie" if html.include?('action="https://consent.youtube.com/s"')
      end

      html
    end
  end

  class TranscriptList
    include HTTParty
    base_uri 'https://www.youtube.com'
  
    attr_reader :video_id, :manually_created_transcripts, :generated_transcripts, :translation_languages
  
    def initialize(video_id, manually_created_transcripts, generated_transcripts, translation_languages)
      @video_id = video_id
      @manually_created_transcripts = manually_created_transcripts
      @generated_transcripts = generated_transcripts
      @translation_languages = translation_languages
    end
  
    def self.build(video_id, captions_json)
      translation_languages = captions_json.fetch('translationLanguages', []).map do |tl|
        { language: tl['languageName']['simpleText'], language_code: tl['languageCode'] }
      end
  
      manually_created = {}
      generated = {}
  
      captions_json['captionTracks'].each do |caption|
        transcript = Transcript.new(
          video_id,
          caption['baseUrl'],
          caption['name']['simpleText'],
          caption['languageCode'],
          caption.fetch('kind', '') == 'asr',
          translation_languages
        )
  
        if caption.fetch('kind', '') == 'asr'
          generated[caption['languageCode']] = transcript
        else
          manually_created[caption['languageCode']] = transcript
        end
      end
  
      new(video_id, manually_created, generated, translation_languages)
    end
  
    def find_transcript(language_codes)
      _find_transcript(language_codes, [@manually_created_transcripts, @generated_transcripts])
    end
  
    def find_generated_transcript(language_codes)
      _find_transcript(language_codes, [@generated_transcripts])
    end
  
    def find_manually_created_transcript(language_codes)
      _find_transcript(language_codes, [@manually_created_transcripts])
    end
  
    private
  
    def _find_transcript(language_codes, transcript_dicts)
      language_codes.each do |code|
        transcript_dicts.each do |dict|
          return dict[code] if dict.key?(code)
        end
      end
      raise 'NoTranscriptFound'
    end
  end

  class Transcript
    include HTTParty
    base_uri 'https://www.youtube.com'

    def initialize(video_id, url, language, language_code, is_generated, translation_languages)
      @video_id = video_id
      @url = url
      @language = language
      @language_code = language_code
      @is_generated = is_generated
      @translation_languages = translation_languages
    end

    def fetch(preserve_formatting: false)
      response = self.class.get(@url, headers: { 'Accept-Language': 'en-US' })
      raise HTTParty::ResponseError.new(response), "Failed to fetch transcript" unless response.success?

      TranscriptParser.new(preserve_formatting: preserve_formatting).parse(response.body)
    end

    def translate(language_code)
      raise 'TranslationLanguageNotAvailable' unless @translation_languages.any? { |lang| lang[:language_code] == language_code }

      translated_url = "#{@url}&tlang=#{language_code}"
      self.class.new(@video_id, translated_url, @translation_languages.find { |lang| lang[:language_code] == language_code }[:language], language_code, true, [])
    end
  end

  class TranscriptParser
  
    def initialize(preserve_formatting: false)
      @preserve_formatting = preserve_formatting
    end
  
    def parse(data)
      doc = Nokogiri::HTML(data)
      doc.xpath('//transcript').children.map do |node|
        parse_transcript_node(node)
      end
    end
  
    private
  
    def parse_transcript_node(node)
      text = @preserve_formatting ? node.text : strip_tags(node.text)
      {
        text: text,
        start: node['start'].to_f,
        duration: node['dur'].to_f
      }
    end
  
    def strip_tags(str)
      # Simple method to remove HTML tags from a string
      # More complex HTML might require a more robust solution
      ActionView::Base.full_sanitizer.sanitize(str)
    end
  end
end