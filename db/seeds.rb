# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

first_account = Account.create(email: "test@diatom.lv", password: "qwerty123", is_admin: false)
second_account = Account.create(email: "super_mario@diatom.lv", password: "qwerty123", is_admin: false)
third_account = Account.create(email: "batman@diatom.lv", password: "qwerty123", is_admin: false)
admin_account = Account.create(email: "lauris@diatom.lv", password: "qwerty123", is_admin: true)

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