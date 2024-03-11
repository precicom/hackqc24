class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    user = User.new(user_params)

    if user.valid? && user.save
      payload = {
        user_id: user.id,
        exp: 12.hours.from_now.to_i # Set expiration to 12 hours
      }
      token = JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
      render json: { token: "Bearer #{token}" }, status: :created
    else
      render json: { error: 'Failed to create user' },
             status: :not_acceptable
    end
  end

  private

  def user_params
    params.permit(:email)
  end
end
