module Moderatable
  extend ActiveSupport::Concern

  included do
    after_create :moderate!
  end

  def moderate!
    client = OpenAI::Client.new
    response = client.moderations(parameters: { input: moderatable_content })
    if response.dig('results', 0, 'flagged')
      self.reject!
    else
      self.approve!
    end
  end

  def approve!
    update!(status: :accepted)
  end

  def reject!
    update!(status: :rejected)
  end

  # Class methods can be added like this
  class_methods do
    def moderate_all
      where(status: :in_process).each(&:moderate!)
    end
  end
end