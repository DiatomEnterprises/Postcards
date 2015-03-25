class Receiver < ActiveRecord::Base

	belongs_to :account
  delegate :email, to: :account
  validates :first_name, :last_name, :city, :country, :zip, :birthday, :address_line_1, presence: true

  def fullname
    '#{first_name} #{last_name}'
  end
end
