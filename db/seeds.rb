# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

first_account = Account.create(email: 'info@postcards1.com', password: 'qwerty123', first_name: 'Info 1', last_name: 'Postcards 1')
second_account = Account.create(email: 'info@postcards2.com', password: 'qwerty123', first_name: 'Info 2', last_name: 'Postcards 2')
third_account = Account.create(email: 'info@postcards3.com', password: 'qwerty123', first_name: 'Info 3', last_name: 'Postcards 3')
admin_account = Account.create(email: 'info@postcards.com', password: 'qwerty123', first_name: 'Info Admin', last_name: 'Postcards Admin')
admin_account.add_role(:admin)

10.times do
  Receiver.create(
    first_name: Faker::Name.first_name, 
    last_name: Faker::Name.last_name, 
    city: Faker::Address.city, 
    country: Faker::Address.country, 
    zip: Faker::Address.zip, 
    address_line_1: Faker::Address.street_address, 
    address_line_2: Faker::Address.secondary_address, 
    account_id: first_account.id, 
    state_or_province: Faker::Address.state, 
    birthday: DateTime.new((DateTime.now - Random.rand(40).years).year, Random.rand(1..12), Random.rand(1..28))
  ) 
end

10.times do
  Receiver.create(
    first_name: Faker::Name.first_name, 
    last_name: Faker::Name.last_name, 
    city: Faker::Address.city, 
    country: Faker::Address.country, 
    zip: Faker::Address.zip, 
    address_line_1: Faker::Address.street_address, 
    address_line_2: Faker::Address.secondary_address, 
    account_id: second_account.id, 
    state_or_province: Faker::Address.state, 
    birthday: DateTime.new((DateTime.now - Random.rand(40).years).year, Random.rand(1..12), Random.rand(1..28))
  ) 
end

10.times do
  Receiver.create(
    first_name: Faker::Name.first_name, 
    last_name: Faker::Name.last_name, 
    city: Faker::Address.city, 
    country: Faker::Address.country, 
    zip: Faker::Address.zip, 
    address_line_1: Faker::Address.street_address, 
    address_line_2: Faker::Address.secondary_address, 
    account_id: third_account.id, 
    state_or_province: Faker::Address.state, 
    birthday: DateTime.new((DateTime.now - Random.rand(40).years).year, Random.rand(1..12), Random.rand(1..28))
  ) 
end

10.times do
  Receiver.create(
    first_name: Faker::Name.first_name, 
    last_name: Faker::Name.last_name, 
    city: Faker::Address.city, 
    country: Faker::Address.country, 
    zip: Faker::Address.zip, 
    address_line_1: Faker::Address.street_address, 
    address_line_2: Faker::Address.secondary_address, 
    account_id: admin_account.id, 
    state_or_province: Faker::Address.state, 
    birthday: DateTime.new((DateTime.now - Random.rand(40).years).year, Random.rand(1..12), Random.rand(1..28))
  ) 
end