class CreateReceivers < ActiveRecord::Migration
  def change
    create_table :receivers do |t|
      t.string :first_name
      t.string :last_name
      t.string :city
      t.string :country
      t.string :zip
      t.string :address_line_1
      t.string :address_line_2
      t.string :address_line_3

      t.timestamps
    end
  end
end
