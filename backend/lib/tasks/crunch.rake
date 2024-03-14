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
    # existing = Council.find_by(date: date)
    # existing.destroy! if existing
    
    transcript = Transcripter::YouTubeTranscripter.fetch_transcript(video_id).map { |e| e[:text]}.join(' ')
    client = OpenAI::Client.new
    # prompt = "###Instructions###\nIdentifie dans la transcription de la rencontre qui est ci-bas les sections granulaires et donne moi un titre pour chaque section spécifique comme réponse en respectant le format ci-dessous.\n\n###Transcription###\n#{transcript}\n\n###Exemple###\n - Adoption du réglement ABC-2\n - Question sur l'avancement des travaux de la rue Pouliot\n - Adoption du budget de la ville\n\n###Sections###\n"
    # prompt = "###Instructions###\nSépare la transcription de la rencontre qui est ci-bas en sections assez précises et donne moi un titre spécifique suivi d'une phrase résumant le contenu de la section comme réponse dans une liste à point sans numérotation en respectant le format ci-dessous, énumère les différents réglements, lois, contrats dans le titre des sections.\n\n###Transcription###\n#{transcript}\n\n###Format###\n - Section 1: Résumé de la section 1\n - Section 2: Résumé de la section 2\n - Section 3: Résumé de la section 3\n\n###Sections###\n"
    clean_up_transcript_prompt = "###Instructions###
    Votre mission est d'effectuer un nettoyage initial du transcript de la réunion du conseil de ville fourni ci-dessous. Concentrez-vous sur l'élimination des éléments suivants pour clarifier et condenser le texte, le rendant ainsi prêt pour une analyse détaillée des points abordés durant la réunion :
    
    1. **Salutations et formalités d'ouverture/fermeture** : Supprimez les salutations, les introductions des participants et les formules de clôture de la réunion.
    2. **Pauses et hésitations** : Éliminez les marqueurs de pause (par exemple, 'euh', 'hm', etc.) et les répétitions inutiles de mots ou de phrases.
    3. **Digressions** : Retirez les sections qui s'écartent significativement du sujet principal de discussion ou qui ne contribuent pas à l'avancement des points à l'ordre du jour.
    4. **Redondances** : Simplifiez les passages qui répètent la même information en différents termes pour n'en garder qu'une expression claire et concise.
    5. **Informations personnelles et sensibles** : Assurez-vous d'anonymiser ou de supprimer toute information personnelle identifiable ou sensible mentionnée durant la réunion.
    
    ### Transcription originale ###
    #{transcript}
    
    ### Transcription nettoyée ###
    "

    puts "Rough tokens: #{OpenAI.rough_token_count(clean_up_transcript_prompt)}"
    clean_up_transcript_response = client.chat(
    parameters: {
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "user", content: clean_up_transcript_prompt }
        ],
        temperature: 0.2,
    })
    # points = clean_up_transcript_response.dig("choices", 0, "message", "content").split("\n").map { |l| l.gsub('- ', '')}
    puts clean_up_transcript_response.dig("choices", 0, "message", "content")
    clean_up_transcripte = clean_up_transcript_response.dig("choices", 0, "message", "content")

     discussion_points_prompt ="### Instructions ###
     L'objectif est de décomposer la transcription de la rencontre du conseil de ville ci-dessous en sections clairement définies. 
     Pour chaque section identifiée, fournissez un titre concis qui résume le sujet ou l'action principale discutée. 
     Assurez-vous de capturer non seulement les décisions prises (comme l'adoption de règlements ou de budgets), 
     mais aussi les discussions importantes, les questions soulevées par les membres du conseil ou le public, 
     ainsi que les annonces ou les mises à jour fournies. Si des numéros de points ou des titres spécifiques sont mentionnés dans la transcription, 
     utilisez-les pour guider votre structuration. L'objectif est d'offrir un aperçu clair et précis de tous les points à l'ordre du jour et de leur traitement durant la réunion. 
     Ignorer l'ouverture de la Séance, l'adoption de l'ordre du jour. Ignorer l'adoption des procès-verbaux de debut de seance et information de fin de seance periode de question réponse.
     
     ### Transcription ###
     #{clean_up_transcripte}
     
     ### Exemple ###
     [
      {
        point: 1,
        title: Plan Régional des Milieux Humides et Hydriques,  
        description: Approbation d'un contrat pour des services professionnels avec augmentation du montant maximal pour finaliser les travaux du plan.
      }, {
        point: 2,
        title: Étude sur l'Impact du Prélèvement d'Eau,
        description: Attribution d'un contrat pour une étude scientifique évaluant les impacts du prélèvement de l'eau brute sur l'intégrité écologique du lac à la pêche.
      }, {
        point: 3,
        title: Nettoyage des Conduites d'Égouts,
        description: Octroi d'un contrat au plus bas soumissionnaire conforme pour le nettoyage des conduites d'égouts.
      }, {
        point: 4,
        title: Gestion des Débordements,
        description: Approbation d'une campagne de mesure de débit dans le cadre du plan de gestion des débordements.
      }, {
        point: 5,
        title: Renouvellement de Contrats pour le Traitement des Eaux,
        description: Adoption du renouvellement de contrats pour le service de location et d'opération d'une unité de traitement des eaux résiduaires et pour la reconstruction de bordures et de trottoirs.
      }, {
        point: 6,
        title: Règlement sur les Nuisances Environnementales,
        description: Présentation d'un avis de motion et dépôt du projet modifiant le règlement général sur les nuisances environnementales et la tarification.
      }, {
        point: 7,
        title: Adoption de Règlements d'Emprunt,
        description: Adoption de deux règlements concernant des emprunts pour divers travaux de réfection.
      }, {
        point: 8,
        title: Soutien à la Corporation Culturelle,
        description: Autorisation de décaissement pour la corporation culturelle de la ville en raison de problèmes de liquidité.
      }, {
        point: 9,
        title: Désignation des Membres du Conseil Local du Patrimoine,
        description: Désignation effectuée pour les membres du conseil local du patrimoine.  
      }
     ]
     "

     puts "Rough tokens: #{OpenAI.rough_token_count(discussion_points_prompt)}"
     discussion_points_response = client.chat(
     parameters: {
         model: "gpt-4-turbo-preview",
         messages: [
           { role: "user", content: discussion_points_prompt }
         ],
         temperature: 0.2,
     })

     puts discussion_points_response.dig("choices", 0, "message", "content")

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