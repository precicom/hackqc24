class UserVote < ApplicationRecord
  belongs_to :reference, polymorphic: true, optional: false
  belongs_to :user

  after_save do
    if reference_type == 'Post'
      PostChannel.broadcast_message(reference_id, 'post_changed')
    end
  end
end
