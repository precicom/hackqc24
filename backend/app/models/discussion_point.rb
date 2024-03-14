class DiscussionPoint < ApplicationRecord
  include Themable

  belongs_to :theme, optional: true
  belongs_to :council

  after_create :process

  def classifiable_content
    title
  end

  def process
    if theme.nil?
      classify!
    end
  end

end
