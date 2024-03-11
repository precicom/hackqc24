class ApplicationController < ActionController::API
  before_action :verify_authenticity_token

  def verify_authenticity_token
    authorization_header = request.headers['Authorization'] || ''

    jwt = Auth::AccessToken.new(authorization_header)

    if payload = jwt.verify
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
