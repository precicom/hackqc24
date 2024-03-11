class UserVote < ApplicationRecord
  belongs_to :reference, polymorphic: true, optional: false
  belongs_to :user
end
