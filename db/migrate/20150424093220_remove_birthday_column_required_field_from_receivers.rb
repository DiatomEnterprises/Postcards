class RemoveBirthdayColumnRequiredFieldFromReceivers < ActiveRecord::Migration
  def up
    change_column_null(:receivers, :birthday,         true)
  end

  def down
    change_column_null(:receivers, :birthday,         false)
  end
end
