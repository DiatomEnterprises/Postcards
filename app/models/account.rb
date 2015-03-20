class Account < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :receivers

  validates :first_name, :last_name, presence: true
  after_create :assign_default_role

  def add_role(new_role)
    unless has_role?(new_role.to_s)
      roles_will_change!
      roles.push(new_role.to_s)
      roles.uniq!
      save
    end
  end

  def remove_role(old_role)
    if has_role?(old_role.to_s)
      roles_will_change!
      roles.delete(old_role.to_s)
      roles.uniq!
      save
    end
  end

  def has_role?(given_role)
    self.roles = [] if self.roles == nil
    roles.include?(given_role.to_s)
  end

  def is_admin?
    has_role?(:admin)
  end

  private

  def assign_default_role
    add_role(:user) unless has_role?(:user)
  end
end
