class AccountsPresenter
  attr_reader :roles
  def initialize
    @roles = nil
  end

  def get_roles
    @roles ||= Account.all.map {|account| account.roles}.flatten.uniq
  end
end