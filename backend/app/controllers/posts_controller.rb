class PostsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[index show]

  def index
    posts = Post.all.where(status: 'accepted')
    render json: posts, status: :ok
  end

  def my_posts
    posts = Post.includes(:comments, :user_votes).all.where(user_id: current_user.id).order('created_at DESC')
    render json: posts, status: :ok
  end

  def create
    post = Post.new(permitted_params)
    post.user_id = current_user.id
    if post.save
      render json: post, status: :created
    else
      render json: { error: 'Failed to create a post' },
             status: :not_acceptable
    end
  end

  def up_vote
    post = Post.find(params[:id])

    user_vote = post.user_votes.find_or_initialize_by(user_id: current_user.id)
    user_vote.is_downvote = false
    user_vote.save
  end

  def down_vote
    post = Post.find(params[:id])

    user_vote = post.user_votes.find_or_initialize_by(user_id: current_user.id)
    user_vote.is_downvote = true
    user_vote.save
  end

  def comments
    post = Post.find(params[:id])
    comments = post.comments
    render json: comments, status: :ok
  end

  def show
    post = Post.find(params[:id])
    render json: post, include: ['user_votes', 'comments', 'comments.user_votes', 'theme'], status: :ok
  end

  def update
    post = Post.find(params[:id])
    if post.update(permitted_params)
      render json: post, status: :ok
    else
      render json: { error: 'Failed to update a post' },
             status: :not_acceptable
    end
  end

  def destroy
    post = Post.find(params[:id])
    if post.destroy
      render json: { message: 'Post has been desroyed' }, status: :ok
    else
      render json: { error: 'Failed to destroy post' },
             status: :not_acceptable
    end
  end

  private

  def permitted_params
    params.require(:post).permit(:content_text, :image)
  end
end
