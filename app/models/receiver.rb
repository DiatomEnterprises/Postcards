class Receiver < ActiveRecord::Base

	belongs_to :account
  delegate :email, to: :account
  validates :first_name, :last_name, :birthday, :address_line_1, presence: true
  attr_accessor :additional_info
end
