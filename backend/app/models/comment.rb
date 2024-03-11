class Comment < ApplicationRecord
  include Moderatable

  enum :status, {
    in_process: 0,
    accepted: 1,
    rejected: 2
  }

  belongs_to :user
  belongs_to :post

  def moderatable_content
    content_text
  end
end
