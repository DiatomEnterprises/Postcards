class Receiver < ActiveRecord::Base

	belongs_to :account
  delegate :email, to: :account
  validates :first_name, :last_name, :birthday, :address_line_1, presence: true
  attr_accessor :additional_info

  def full_name
    "#{first_name} #{last_name}"
  end

  def full_location(city: true, state: true, country: true, zip: true)
    location = []
    location << self.city if !self.city.empty? && city
    location << self.state if !self.state.empty? && state
    location << self.country if !self.country.empty? && country
    location << self.zip if !self.zip.empty? && zip
    location.join(', ')
  end
end
