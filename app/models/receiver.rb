class Receiver < ActiveRecord::Base

	belongs_to :account
  delegate :email, to: :account
  validates :first_name, :last_name, :birthday, :address_line_1, presence: true
  attr_accessor :additional_info

  def full_name
    "#{first_name} #{last_name}"
  end

  def full_location
    location = ''
    location = "#{self.city}, " if self.city
    location = location + "#{self.state}, " if self.state
    location = location + "#{self.country}" if self.country
    location
  end
end
