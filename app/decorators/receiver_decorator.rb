class ReceiverDecorator < Draper::Decorator
  delegate_all
  decorates_finders

  def full_name
    "#{receiver.first_name} #{receiver.last_name}"
  end

  def full_location(city: true, state: true, country: true, zip: true)
    location = []
    location << receiver.city if !receiver.city.present? && city
    location << receiver.state if !receiver.state.present? && state
    location << receiver.country if !receiver.country.present? && country
    location << receiver.zip if !receiver.zip.present? && zip
    location.join(', ')
  end
end