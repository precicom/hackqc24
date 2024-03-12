module Moderatable
  extend ActiveSupport::Concern

  included do
    after_create :moderate!
  end

  def moderate!
    client = OpenAI::Client.new
    response = client.moderations(parameters: { input: moderatable_content })
    if response.dig('results', 0, 'flagged')
      self.reject!(response)
    else
      self.approve!
    end
  end

  def approve!
    update!(status: :accepted)
  end

  def reject!(moderation_res)
    client = OpenAI::Client.new
    response = client.chat(
    parameters: {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Un message a été évalué par notre bot de modération et a été identifié comme contenant du harcèlement,
       nécessitant une réponse ferme et directe sans excuses. Voici les détails de l'évaluation :
        \n\n#{moderation_res}\n\n
        Sur la base de ces informations, rédigez une réponse simple et courte en français qui souligne l'importance du respect des règles de la communauté, 
        l'intolérance face au harcèlement, et qui informe l'utilisateur que son message a été rejeté en raison de ces violations. 
        Mentionnez également les actions potentielles en cas de récidive de ce comportement. Finir la réponse avec la phrase suivante: KizosBot"}],
      temperature: 0.7,
    })

    update!(status: :rejected, rejection_reason: response.dig("choices", 0, "message", "content"))
  end

  # Class methods can be added like this
  class_methods do
    def moderate_all
      where(status: :in_process).each(&:moderate!)
    end
  end
end