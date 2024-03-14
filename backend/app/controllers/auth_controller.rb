class AuthController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]  

  def create
    email = params[:email]
    fb_token = params[:fb_token]
    user = nil
    if email
      user = User.find_by(email: email)
    elsif fb_token
      res = HTTParty.get("https://graph.facebook.com/v2.8/me", query: { access_token: fb_token, fields: 'email,name' })
      email = res.parsed_response['email'] if res.code == 200
      user = User.find_or_create_by(email: email)
    end

    if user
      # User found, create and return a JWT token
      payload = {
        user_id: user.id,
        exp: 12.hours.from_now.to_i # Set expiration to 12 hours
      }

      token = JWT.encode(payload, Rails.application.secret_key_base, 'HS256')

      render json: { token: "Bearer #{token}" }, status: :ok
    else
      # User not found
      render json: { error: 'Invalid email or user does not exist' }, status: :unauthorized
    end
  end
end
