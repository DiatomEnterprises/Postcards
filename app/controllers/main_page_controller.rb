class MainPageController < ApplicationController
	def index
	end

  def accounts
    authorize current_account
    render 'accounts/index'
  end
end
