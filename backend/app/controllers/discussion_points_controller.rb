class DiscussionPointsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index, :show]

  def index
    discussion_points = DiscussionPoint.all
    render json: discussion_points, status: :ok
  end

  def create
    discussion_point = DiscussionPoint.new(permitted_params)
      # discussion_point.user_id = current_user.id
      if discussion_point.save     
         render json: discussion_point, status: :created
      else
         render json: { error: 'Failed to create a discussion_point' }, 
            status: :not_acceptable
      end
  end

  def show
      discussion_point = DiscussionPoint.find(params[:id])
      render json: discussion_point, status: :ok
  end

  def update
      discussion_point = DiscussionPoint.find(params[:id])
      if discussion_point.update(permitted_params)   
         render json: discussion_point, status: :ok
      else
         render json: { error: 'Failed to update a discussion_point' }, 
            status: :not_acceptable
      end
  end

  def destroy
      discussion_point = DiscussionPoint.find(params[:id])
      if discussion_point.destroy
         render json: {message: 'DiscussionPoint has been desroyed'}, status: :ok
      else
         render json: { error: 'Failed to destroy discussion_point' }, 
            status: :not_acceptable
      end
  end

  private
  def permitted_params
     params.permit(:generated_summary, :minute_link_url)
  end
end
