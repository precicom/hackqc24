class CommentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[index show]

  def index
    comments = Comment.all
    render json: comments, status: :ok
  end

  def create
    comment = Comment.new(permitted_params)

    comment.assign_attributes(user_id: current_user.id)

    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors }, status: :not_acceptable
    end
  end

  def up_vote
    comment = Comment.find(params[:id])

    comment.user_votes.create(user_id: current_user.id, is_downvote: false)
  end

  def down_vote
    comment = Comment.find(params[:id])

    comment.user_votes.create(user_id: current_user.id, is_downvote: true)
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
    params.require(:comment).permit(:post_id, :content_text, :rejection_reason, :image)
  end
end
