class Post < ApplicationRecord
  belongs_to :user
  belongs_to :theme, optional: true

  enum :status, { in_process: 0, accepted: 1, rejected: 2 }

  has_many :comments
  has_many :user_votes
  
  accepts_nested_attributes_for :comments
  accepts_nested_attributes_for :user_votes
end
