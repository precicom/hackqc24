class DiscussionPointsController < ApplicationController
  before_action :get_council
  skip_before_action :verify_authenticity_token, only: %i[index show]

  def index
    discussion_points = @council.discussion_points
    render json: discussion_points, status: :ok
  end

  def create
    discussion_point = @council.discussion_points.new(permitted_params)
    if discussion_point.save
      render json: discussion_point, status: :created
    else
      render json: { error: 'Failed to create a discussion_point' },
             status: :not_acceptable
    end
  end

  def show
    discussion_point = @council.discussion_points.find(params[:id])
    render json: discussion_point, status: :ok
  end

  def update
    discussion_point = @council.discussion_points.find(params[:id])
    if discussion_point.update(permitted_params)
      render json: discussion_point, status: :ok
    else
      render json: { error: 'Failed to update a discussion_point' },
             status: :not_acceptable
    end
  end

  def destroy
    discussion_point = @council.discussion_points.find(params[:id])
    if discussion_point.destroy
      render json: { message: 'DiscussionPoint has been desroyed' }, status: :ok
    else
      render json: { error: 'Failed to destroy discussion_point' },
             status: :not_acceptable
    end
  end

  private

  def get_council
    @council = if params[:council_id] == 'last'
                 Council.order(date: :desc).first
               else
                 Council.find(params[:council_id])
               end
  end

  def permitted_params
    params.permit(:generated_summary, :minute_link_url)
  end
end
