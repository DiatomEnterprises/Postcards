class ReceiverDecorator < Draper::Decorator
  delegate_all
  decorates_finders

  def full_name
    "#{receiver.first_name} #{receiver.last_name}"
  end

  def full_location(city: true, state: true, country: true, zip: true)
    location = []
    location << receiver.city if !receiver.city.empty? && city
    location << receiver.state if !receiver.state.empty? && state
    location << receiver.country if !receiver.country.empty? && country
    location << receiver.zip if !receiver.zip.empty? && zip
    location.join(', ')
  end
end