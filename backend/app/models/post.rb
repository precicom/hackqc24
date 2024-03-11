class Post < ApplicationRecord
  belongs_to :user
  belongs_to :theme

  enum :status, {
    in_process: 0,
    accepted: 1,
    rejected: 2,
  }
end
