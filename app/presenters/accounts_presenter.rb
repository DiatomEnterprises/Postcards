class AccountsPresenter

  attr_reader :start_date, :end_date, :month, :account

  def initialize(params, account)
    @account = account
    @start_date = params.fetch("start_date", nil)
    @end_date = params.fetch("end_date", nil)
  end

  def list
    if acccount.is_admin
      filter
    else
      "You don't have access!"
    end
  end

  private

  def filter
    accounts_list = Account.all
    accounts_list = accounts_list.where('extract(month from birthday) = ?', month) if month.present?
    accounts_list = accounts_list.where(created_at: start_date..end_date) if start_date.present? && end_date.present?
    accounts_list
  end
end