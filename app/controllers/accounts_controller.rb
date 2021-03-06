class AccountsController < ApplicationController
  before_action :validate_access

  def index
    @accounts = Account.all
  end

  def show
    @account = Account.find(params[:id])
  end

  def create
    @account = Account.new(updated_account_params)
    if @account.save
      @account
    else
      render_failure(@account.errors.full_messages)
    end
  end

  def update
    @account = Account.find(params[:id])
    if @account.update(updated_account_params)
      @account
    else
      render_failure(@account.errors.full_messages)
    end
  end

  def destroy
    @account = Account.find(params[:id])
    if @account.destroy
      Receiver.where(account_id: params[:id]).update_all(account_id: 0)
      @account
    else
      render_failure(@account.errors.full_messages)
    end
  end

  def get_roles
    @roles = AccountsPresenter.new
    @roles.get_roles
  end

  private

  def validate_access
    authorize current_account
  end

  def updated_account_params
    new_roles = params['roles'].class == String ? JSON.parse(params['roles']) : params['roles']

    new_params = account_params
    new_params['roles'] = new_roles
    new_params
  end

  def role_params
    params.permit(:name)
  end

  def account_params
    params.permit(:email, :first_name, :last_name, :password, :password_confirmation, :roles)
  end
end
