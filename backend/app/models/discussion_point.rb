class DiscussionPoint < ApplicationRecord
  belongs_to :theme, optional: true
  belongs_to :council
end
