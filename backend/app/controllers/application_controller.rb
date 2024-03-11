class ApplicationController < ActionController::API
  before_action :verify_authenticity_token

  attr_reader :current_user

  def verify_authenticity_token
    debugger
    authorization_header = request.headers['Authorization'] || ''
    token = authorization_header.split(' ')[1]

    decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })

    if (payload = decoded_token&.first&.deep_symbolize_keys)
      user_id = payload[:user_id]
      exp = payload[:exp]

      # Check if the exp date is less than the current time
      raise Auth::Unauthorized, 'token expired' if exp < Time.now.to_i

      @current_user = User.find(user_id)

      raise Auth::Forbidden, 'user not found' unless @current_user
    end

    return true if @current_user

    raise Auth::Unauthorized, 'invalid token'
  end
end
