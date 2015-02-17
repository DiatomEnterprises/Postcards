class AddBirthdayToRevievers < ActiveRecord::Migration
  def change
    add_column :receivers, :birthday, :date
  end
end
