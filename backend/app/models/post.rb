class Post < ApplicationRecord
  belongs_to :user
  belongs_to :theme, optional: true

  has_many :comments, dependent: :destroy
  has_many :user_votes, as: :reference, dependent: :destroy

  enum :status, { in_process: 0, accepted: 1, rejected: 2 }

  has_many :comments
  has_many :user_votes
end
