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

  task :councilv2, [:youtube_link] => :environment do |t, args|
    youtube_link = args[:youtube_link]
    video_id = extract_youtube_video_id(youtube_link)
    puts "Extracted Video ID: #{video_id}"

    youtube_service = Google::Apis::YoutubeV3::YouTubeService.new
    youtube_service.key = ENV.fetch("YT_API_KEY")

    title = youtube_service.list_videos('snippet', id: video_id).items.first.snippet.title
    date = DateTime.parse(title).end_of_day
    existing = Council.find_by(date: date)
    existing.destroy! if existing
    
    transcript = Transcripter::YouTubeTranscripter.fetch_transcript(video_id).map { |e| e[:text]}.join(' ')
    client = OpenAI::Client.new
    prompt = "###Instructions###\nIdentifie dans la transcription de la rencontre qui est ci-bas les sections granulaires et donne moi un titre pour chaque section spécifique comme réponse en respectant le format ci-dessous.\n\n###Transcription###\n#{transcript}\n\n###Exemple###\n - Adoption du réglement ABC-2\n - Question sur l'avancement des travaux de la rue Pouliot\n - Adoption du budget de la ville\n\n###Sections###\n"
    # prompt = "###Instructions###\nSépare la transcription de la rencontre qui est ci-bas en sections assez précises et donne moi un titre spécifique suivi d'une phrase résumant le contenu de la section comme réponse dans une liste à point sans numérotation en respectant le format ci-dessous, énumère les différents réglements, lois, contrats dans le titre des sections.\n\n###Transcription###\n#{transcript}\n\n###Format###\n - Section 1: Résumé de la section 1\n - Section 2: Résumé de la section 2\n - Section 3: Résumé de la section 3\n\n###Sections###\n"
    puts "Rough tokens: #{OpenAI.rough_token_count(prompt)}"
    response = client.chat(
    parameters: {
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
    })
    points = response.dig("choices", 0, "message", "content").split("\n").map { |l| l.gsub('- ', '')}
    puts response.dig("choices", 0, "message", "content")
    # prompt = "###Instructions###\n.Pour chaque section de la transcription listée ci-dessous, analyse la transcription JSON pour identifier le début de cette section dans le champ 'text' et donne la valeur du champ 'start' la plus près du début\n\n###Sections###\n#{response.dig("choices", 0, "message", "content")}\n\n###Transcription###\n#{json_transcript}\n\n###Début de chaque section###\n"
    # puts "Rough tokens: #{OpenAI.rough_token_count(prompt)}"
    # response = client.chat(
    # parameters: {
    #     model: "gpt-4-turbo-preview",
    #     messages: [
    #       { role: "user", content: prompt }
    #     ],
    #     temperature: 0.5,
    # })
    # puts response.dig("choices", 0, "message", "content")

    # council = Council.create!(title: title, date: date, youtube_link: youtube_link)
    # points.each do |point|
    #   council.discussion_points.create!(title: point)
    # end
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