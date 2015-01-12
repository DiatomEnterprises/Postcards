namespace :dummy do
  desc "Add dummy data"
  task :data => :environment do
  	puts "add some data"
  	Account.create(email: "test@test.lv", password: "qwerty123")
  	Receiver.create(first_name: "Lauris", last_name: "Blīgzna", city: "Rīga", country: "Latvija", zip: "3301", address_line_1: "Straupes 5", account_id: Account.first.id)
  	Receiver.create(first_name: "Jānis", last_name: "Miezītis", city: "Rīga", country: "Latvija", zip: "3301", address_line_1: "Straupes 5", account_id: Account.first.id)
  	Receiver.create(first_name: "Dainis", last_name: "Lapiņš", city: "Rīga", country: "Latvija", zip: "3301", address_line_1: "Straupes 5", account_id: Account.first.id)
  	Receiver.create(first_name: "Arturs", last_name: "Traubergs", city: "Rīga", country: "Latvija", zip: "3301", address_line_1: "Straupes 5", account_id: Account.first.id)
  	puts "Done"
  end
end