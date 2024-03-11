namespace :crunch do
  task :council, [:youtube_link] => :environment do |t, args|
    youtube_link = args[:youtube_link]
    video_id = extract_youtube_video_id(youtube_link)
    puts "Extracted Video ID: #{video_id}"
    transcript = Transcripter::YouTubeTranscripter.fetch_transcript(video_id)
    client = OpenAI::Client.new
    puts "Rough tokens: #{OpenAI.rough_token_count("#{transcript}\n\n---\n\n Le document JSON ci-haut est la transcription d'un conseil de ville. Le champ 'text' de chaque élément contient ce qui a été dit à différent moments. Résume moi tous les grands points discutés et insère la valeur du champ 'start' qui correspond au début de quand ce point a été discuté.")}"
    response = client.chat(
    parameters: {
        model: "gpt-4-turbo-preview",
        messages: [
          # {role: "system", content: "Tu est une IA qui prend des notes durant l'écoute. Tu réponds seulement en utilisant du JSON selon ce format: [{'point': string, 'start': number}, ...]."},
          { role: "user", content: "#{transcript}\n\n---\n\n Le document JSON ci-haut est la transcription d'un conseil de ville. Le champ 'text' de chaque élément contient ce qui a été dit à différent moments. Résume moi tous les points discutés tout au long du conseil. Inclu la valeur de 'start' qui correspond au début du point."}],
          # { role: "user", content: "#{transcript}\n\n---\n\n Le document JSON ci-haut est la transcription d'un conseil de ville. Le champ 'text' de chaque élément contient ce qui a été dit à différent moments. Résume moi tous les points discutés sans exception. La valeur du champ 'point' sera le point discuté et 'start' sera la valeur du champ 'start' qui correspond au début du point."}],
        temperature: 0.7,
    })
    puts response.dig("choices", 0, "message", "content")
  end

  def extract_youtube_video_id(url)
    uri = URI(url)

    if uri.path == '/watch' && uri.query
      params = CGI::parse(uri.query)
      params["v"]&.first
    elsif  uri.path.include?('/live/')
      uri.path.gsub('/live/', '')
    else
      nil
    end
  end
end