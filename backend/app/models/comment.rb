class Comment < ApplicationRecord
  include Moderatable

  enum :status, {
    in_process: 0,
    accepted: 1,
    rejected: 2
  }

  belongs_to :user
  belongs_to :post
  has_many :user_votes, as: :reference, dependent: :destroy

  has_one_attached :image

  after_create :process

  after_create do
    PostChannel.broadcast_message(post_id, 'post_changed')
  end

  def moderatable_content
    content_text
  end

  def process
    moderate!
  end
end
