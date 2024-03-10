class ThemesController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:index, :show]

    def index
        themes = Theme.all.order(name: :asc)
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
