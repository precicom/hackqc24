class AuthController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    debugger
    email = params[:email]
    user = User.find_by(email: email)

    if user
      # User found, create and return a JWT token
      payload = {
        user_id: user.id,
        exp: 12.hours.from_now.to_i # Set expiration to 12 hours
      }

      token = JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')

      render json: { token: "Bearer #{token}" }, status: :ok
    else
      # User not found
      render json: { error: 'Invalid email or user does not exist' }, status: :unauthorized
    end
  end
end
