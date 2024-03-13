module Themable
  extend ActiveSupport::Concern

  def classify!
    client = OpenAI::Client.new
    themes = Theme.all.map do |t|
      "ID: #{t.id} | #{t.category} | #{t.name}: #{t.generated_summary}"
    end
    categories = Theme.categories.keys.map do |c|
      "#{c}: #{Theme.category_description(c)}"
    end

    prompt = "###Catégories###\n#{categories.join("\n")}\n\n###Thèmes###\n#{themes.join("\n")}\n\n###Instructions###\nCatégorise le texte suivant selon un des thèmes si une ressemblance existe, utilise l'ID du thème dans la réponse et dans le cas ou le texte se démarque notablement des thèmes, la valeur sera '0'.\n\nTexte: #{classifiable_content}\nThème ID: "
    # puts "Rough tokens: #{OpenAI.rough_token_count(prompt)}"
    response = client.chat(
    parameters: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt}
        ],
        temperature: 0,
    })
    if post_theme = Theme.find_by(id: response.dig("choices", 0, "message", "content"))
      update!(theme: post_theme)
    else
      prompt = "###Catégories###\n#{categories.join("\n")}\n\n###Thèmes###\n#{themes.join("\n")}\n\n###Instructions###\nCréé un nouveau thème pour le texte suivant avec un résumé. Le thème doit être assez générique pour se détacher du contenu spécifique du texte et permettre de combiner plusieurs texte sous un même thème. Catégorise le thème selon la catégorie la mieux adaptée. Utilise le même format que dans la liste de thèmes.\n\nTexte: #{classifiable_content}\n\n###Nouveau thème###\n"
      # puts "Rough tokens: #{OpenAI.rough_token_count(prompt)}"
      response = client.chat(
      parameters: {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt}
          ],
          temperature: 0.5,
      })
      theme_data = response.dig("choices", 0, "message", "content").split(' | ')

      return if theme_data.size != 3

      theme_info = theme_data.last.split(':')
      if new_theme = Theme.create(name: theme_info.first, generated_summary: theme_info.last, category: theme_data.second)
        update!(theme: new_theme)
      end
    end
  end

  # Class methods can be added like this
  class_methods do
    def classify_all
      all.each(&:classify!)
    end
  end
end