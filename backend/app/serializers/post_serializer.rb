class PostSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :user_id, :content_text, :theme_id, :status, :rejection_reason, :created_at, :image, :up_votes, :comments_count

  belongs_to :theme
  belongs_to :user
  has_many :comments
  has_many :user_votes

  def image
    rails_blob_path(object.image, only_path: true) if object.image.attached?
   end
end
