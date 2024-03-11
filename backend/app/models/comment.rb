class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  has_many :user_votes, as: :reference, dependent: :destroy
end
