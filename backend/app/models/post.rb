class Post < ApplicationRecord
  enum :status, {
    in_process: 0
    accepted: 1
    rejected: 2
  }
end
