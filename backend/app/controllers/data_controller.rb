# For actions and stuff that do not fit well in other controllers
class DataController < ApplicationController
  def discussion_points
    discussion_points = DiscussionPoint.all
    render json: discussion_points, status: :ok
  end
end
