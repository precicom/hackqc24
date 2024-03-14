class Council < ApplicationRecord
  has_many :discussion_points
  has_many :themes, through: :discussion_points
end
