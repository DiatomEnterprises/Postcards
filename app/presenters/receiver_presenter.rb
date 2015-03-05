class ReceiverPresenter

  attr_reader :params, :account

  def initialize(params, account)
    @account = account
    @month = params.fetch("month", nil)
    @start_date = params.fetch("start_date", nil)
    @end_date = params.fetch("end_date", nil)
  end

  def list
    if account.is_admin
      for_admin
    else
      for_simple_user
    end
  end

  private

  def for_admin
    Receiver.where('extract(month from birthday) = ?', params["month"]).where(created_at: start_date..end_date)
  end

  def for_simple_user
    account.receivers.where('extract(month from birthday) = ?', params["month"]).where(created_at: start_date..end_date)
  end

end