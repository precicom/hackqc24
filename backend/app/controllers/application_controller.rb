class ApplicationController < ActionController::API
  before_action :verify_authenticity_token

  attr_reader :current_user

  def verify_authenticity_token
    authorization_header = request.headers['Authorization'] || ''
    token = authorization_header.split(' ')[1]

    decoded_token = nil
    begin
      decoded_token = JWT.decode(token, Rails.application.secret_key_base, true, { algorithm: 'HS256' })
    rescue
    end
    
    if (payload = decoded_token&.first&.deep_symbolize_keys)
      user_id = payload[:user_id]
      exp = payload[:exp]

      # Check if the exp date is less than the current time
      if exp < Time.now.to_i
        render status: :unauthorized, json: { error: 'token expired' }
        return
      end

      @current_user = User.find(user_id)

      render status: :unauthorized, json: { error: 'user not found' } unless @current_user
    end

    return true if @current_user

    render status: :unauthorized, json: { error: 'invalid token' } unless @current_user
  end
end
