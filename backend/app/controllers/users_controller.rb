class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:create]
    
    def create
       user = User.new(user_params)
       if user.valid? && user.save
          token = encode_token(user_id: user.id) 
          render json: { user: user, jwt: token }, status: :created
       else
          render json: { error: 'Failed to create user' }, 
             status: :not_acceptable
       end
    end

    private  
    
    def user_params
       params.require(:user).permit(:email)
    end
end
