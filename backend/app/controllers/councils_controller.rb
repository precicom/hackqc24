class CouncilsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index, :show]

  def index
    councils = Council.all
    render json: councils, status: :ok
  end

  def create
    council = Council.new(permitted_params)
      # council.user_id = current_user.id
      if council.save     
         render json: council, status: :created
      else
         render json: { error: 'Failed to create a council' }, 
            status: :not_acceptable
      end
  end

  def show
      council = Council.find(params[:id])
      render json: council, status: :ok
  end

  def update
      council = Council.find(params[:id])
      if council.update(permitted_params)   
         render json: council, status: :ok
      else
         render json: { error: 'Failed to update a council' }, 
            status: :not_acceptable
      end
  end

  def destroy
      council = Council.find(params[:id])
      if council.destroy
         render json: {message: 'Council has been desroyed'}, status: :ok
      else
         render json: { error: 'Failed to destroy council' }, 
            status: :not_acceptable
      end
  end

  private
  def permitted_params
     params.permit(:generated_summary, :minute_link_url)
  end
end
