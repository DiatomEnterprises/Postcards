class Receiver < ActiveRecord::Base

	belongs_to :account
  delegate :email, to: :account

  def fullname
    "#{first_name} #{last_name}"
  end
end
