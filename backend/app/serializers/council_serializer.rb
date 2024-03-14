class CouncilSerializer < ActiveModel::Serializer
  attributes :id, :title, :date, :youtube_link, :generated_summary

  has_many :discussion_points
  has_many :themes, through: :discussion_points
end
