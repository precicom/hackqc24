class PostSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :content_text, :theme_id, :status, :rejection_reason, :created_at

  belongs_to :user
  has_many :comments
  has_many :user_votes
end
