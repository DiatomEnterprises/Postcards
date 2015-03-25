class ApplicationController < ActionController::Base
  include Pundit
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format.include? 'application/json' }

  before_action :authenticate_account!

  def pundit_user
    current_account
  end

  def render_failure(message_array)
    render json: { errors: message_array }, status: 417, success: false
  end
end
