class ApplicationController < ActionController::API
    before_action :verify_authenticity_token
    def verify_authenticity_token
        true
    end

end
