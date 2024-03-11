class UserVote < ApplicationRecord
  belongs_to :user
  belongs_to :posts
  belongs_to :comment
end
