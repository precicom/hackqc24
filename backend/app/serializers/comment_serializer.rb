class CommentSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :post_id, :content_text, :status, :rejection_reason, :created_at

  has_many :user_votes
end
