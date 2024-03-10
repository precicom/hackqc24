class DiscussionPoint < ApplicationRecord
  belongs_to :theme
  belongs_to :council
end
