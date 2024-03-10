class PostsController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:index, :show]

    def index
        posts = Post.all
        render json: posts, status: :ok
    end

    def create
        post = Post.new(permitted_params)
        # post.user_id = current_user.id
        if post.save     
           render json: post, status: :created
        else
           render json: { error: 'Failed to create a post' }, 
              status: :not_acceptable
        end
    end

    def show
        post = Post.find(params[:id])
        render json: post, status: :ok
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
           render json: {message: 'Post has been desroyed'}, status: :ok
        else
           render json: { error: 'Failed to destroy post' }, 
              status: :not_acceptable
        end
    end

    private
    def permitted_params
       params.permit(:content_text)
    end
end
