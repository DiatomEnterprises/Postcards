class AccountPolicy < ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def accounts?
    user.is_admin?
  end

  def get_roles?
    user.is_admin?
  end

  def index?
    user.is_admin?
  end

  def show?
    user.is_admin? && scope.where(:id => record.id).exists?
  end

  def create?
    user.is_admin?
  end

  def new?
    create?
  end

  def update?
    user.is_admin?
  end

  def edit?
    update?
  end

  def destroy?
    user.is_admin?
  end
end

