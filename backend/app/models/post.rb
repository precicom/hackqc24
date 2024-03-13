class Post < ApplicationRecord
  include Moderatable
  include Themable

  enum :status, { in_process: 0, accepted: 1, rejected: 2 }

  belongs_to :user
  belongs_to :theme, optional: true
  has_many :comments, dependent: :destroy
  has_many :user_votes, as: :reference, dependent: :destroy

  has_one_attached :image

  after_create :process

  def moderatable_content
    content_text
  end

  def classifiable_content
    content_text
  end

  def process
    moderate!
    if accepted?
      classify!
    end
  end
end
