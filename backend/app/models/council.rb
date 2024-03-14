class Council < ApplicationRecord
  has_many :discussion_points, dependent: :destroy
end
