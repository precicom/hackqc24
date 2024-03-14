class DiscussionPointSerializer < ActiveModel::Serializer
  attributes :id, :title, :generated_summary, :theme_id, :council_id, :minute_link_url

  belongs_to :theme
end
