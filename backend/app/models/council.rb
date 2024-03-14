class Council < ApplicationRecord
  has_many :discussion_points, dependent: :destroy
  has_many :themes, through: :discussion_points
end
