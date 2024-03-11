class CommentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[index show]

  def index
    comments = Comment.all
    render json: comments, status: :ok
  end

  def create
    comment = Comment.new(permitted_params)
    if comment.save
      render json: comment, status: :created
    else
      render json: { error: 'Failed to create a comment' }, status: :not_acceptable
    end
  end

  def show
    comment = Comment.find(params[:id])
    render json: comment, status: :ok
  end

  def update
    comment = Comment.find(params[:id])
    if comment.update(permitted_params)
      render json: comment, status: :ok
    else
      render json: { error: 'Failed to update a comment' }, status: :not_acceptable
    end
  end

  def destroy
    comment = Comment.find(params[:id])
    if comment.destroy
      render json: { message: 'Comment has been desroyed' }, status: :ok
    else
      render json: { error: 'Failed to destroy comment' }, status: :not_acceptable
    end
  end

  private

  def permitted_params
    params.permit(:post_id, :content_text, :rejection_reason)
  end
end
