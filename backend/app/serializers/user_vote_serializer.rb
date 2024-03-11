class UserVoteSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :is_downvote, :created_at
end
