class CommentSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :user_id, :post_id, :content_text, :status, :rejection_reason, :created_at, :image

  has_many :user_votes, as: :reference

  def image
    rails_blob_path(object.image, only_path: true) if object.image.attached?
  end
end
