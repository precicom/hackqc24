class Post < ApplicationRecord
  include Moderatable

  belongs_to :user
  belongs_to :theme

  enum :status, {
    in_process: 0,
    accepted: 1,
    rejected: 2
  }
  
  def moderatable_content
    content_text
  end
end
