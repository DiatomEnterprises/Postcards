class ReceiversPresenter

  attr_reader :account, :month, :start_date, :end_date

  def initialize(params, account)
    @account = account
    @month = params.fetch('month', nil)
    @start_date = params.fetch('start_date', nil)
    @end_date = params.fetch('end_date', nil)
  end

  def list
    if account.is_admin?
      filter(Receiver.all.includes(:account))
    else
      filter(account.receivers.where(is_deleted: false))
    end
  end

  private

  def filter(receivers)
    receivers_list = receivers
    receivers_list = receivers_list.where('extract(month from birthday) = ?', month) if month.present?
    receivers_list = receivers_list.where(created_at: start_date..end_date) if start_date.present? && end_date.present?
    receivers_list
  end

end