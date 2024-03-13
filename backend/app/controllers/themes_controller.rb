class ThemesController < ApplicationController
   skip_before_action :verify_authenticity_token, only: [:index, :show]

   def index
      themes = Theme.all
      render json: themes, status: :ok
   end

   def popular
      theme_ids = Post.joins("LEFT OUTER JOIN comments on (posts.id = comments.post_id AND comments.created_at > '#{1.month.ago}')", "LEFT OUTER JOIN user_votes on (posts.id = user_votes.reference_id AND user_votes.reference_type = 'Post' AND user_votes.created_at > '#{1.month.ago}')")
          .select("posts.theme_id, count(distinct comments.id) + count(distinct user_votes.id)  AS score")
          .where("posts.created_at > :start OR comments.created_at > :start OR user_votes.created_at > :start", start: 1.month.ago)
          .group("posts.theme_id")
          .order("score DESC, posts.created_at DESC")
          .map(&:theme_id)
          
      themes = Theme.find(theme_ids)
      render json: themes, status: :ok
   end

   def create
      themes = Theme.new(permitted_params)
      if themes.save     
         render json: themes, status: :created
      else
         render json: { error: 'Failed to create a Theme' }, 
            status: :not_acceptable
      end
   end

   def show
      themes = Theme.find(params[:id])
      render json: themes, status: :ok
   end

   def update
      themes = Theme.find(params[:id])
      if themes.update(permitted_params)   
         render json: themes, status: :ok
      else
         render json: { error: 'Failed to update a theme' }, 
            status: :not_acceptable
      end
   end

   def destroy
      themes = Theme.find(params[:id])
      if themes.destroy
         render json: {message: 'Theme has been desroyed'}, status: :ok
      else
         render json: { error: 'Failed to destroy theme' }, 
            status: :not_acceptable
      end
   end

   private
   def permitted_params
      params.permit(:name, :generated_summary, :category)
   end
end
