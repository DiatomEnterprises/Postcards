# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

account = Account.create(email: "lauris@diatom.lv", password: "qwerty123")

30.times do
  Receiver.create(
    first_name: Faker::Name.first_name, 
    last_name: Faker::Name.last_name, 
    city: Faker::Address.city, 
    country: Faker::Address.country, 
    zip: Faker::Address.zip, 
    address_line_1: Faker::Address.street_address, 
    address_line_2: Faker::Address.secondary_address, 
    account_id: account.id, 
    state_or_province: Faker::Address.state, 
    birthday: DateTime.now - (20 + Random.rand(11)).years
  ) 
end