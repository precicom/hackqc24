class UserVotesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index, :show]

  def index
      user_votes = UserVote.all
      render json: user_votes, status: :ok
  end

  def create
      user_vote = UserVote.new(permitted_params)
      # user_vote.user_id = current_user.id
      if user_vote.save     
         render json: user_vote, status: :created
      else
         render json: { error: 'Failed to create a user_vote' }, 
            status: :not_acceptable
      end
  end

  def show
      user_vote = UserVote.find(params[:id])
      render json: user_vote, status: :ok
  end

  def update
      user_vote = UserVote.find(params[:id])
      if user_vote.update(permitted_params)   
         render json: user_vote, status: :ok
      else
         render json: { error: 'Failed to update a user_vote' }, 
            status: :not_acceptable
      end
  end

  def destroy
      user_vote = UserVote.find(params[:id])
      if user_vote.destroy
         render json: {message: 'UserVote has been desroyed'}, status: :ok
      else
         render json: { error: 'Failed to destroy user_vote' }, 
            status: :not_acceptable
      end
  end

  private
  def permitted_params
     params.permit(:post_id,:is_downvote)
  end
end
