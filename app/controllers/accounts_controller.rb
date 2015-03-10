class AccountsController < ApplicationController
  
	def index
    @accounts = Account.all
    respond_to do |format|
      format.html
      format.json  { render json: @accounts }
    end
	end

  def new
    @account = Account.new
  end

  def create
    @account = Account.new(account_params)
    if @account.save
      redirect_to action: "index"
    else
      render "new"
    end
  end

  def edit
    @account = Account.find(params[:id])
  end

  def update
    @account = Account.find(params[:id])
    if @account.update_attributes(account_params)
      redirect_to action: "index"
    else
      render "new"
    end
  end

  def destroy
    @account = Account.find(params[:id])
    if @account.present?
      @account.destroy
    end
    redirect_to action: "index"
  end

  private

  def account_params
    if params[:action] == "update"
      check_password
    end
    params.require(:account).permit(:email, :first_name, :last_name, :password, :password_confirmation, :is_admin)
  end

  def check_password
    if params[:account][:password].blank? && params[:account][:password_confirmation].blank?
      params[:account].delete(:password)
      params[:account].delete(:password_confirmation)
    end
  end

end
