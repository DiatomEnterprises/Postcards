class AddMissingValidationsToReceivers < ActiveRecord::Migration
  def up
    change_column_null(:receivers, :first_name,       false)
    change_column_null(:receivers, :last_name,        false)
    change_column_null(:receivers, :address_line_1,   false)
    change_column_null(:receivers, :birthday,         false)

    change_column_default(:receivers, :state,           '')
    change_column_default(:receivers, :country,         '')
    change_column_default(:receivers, :zip,             '')
    change_column_default(:receivers, :address_line_2,  '')
    change_column_default(:receivers, :city,            '')
  end

  def down
    change_column_null(:receivers, :first_name,       true)
    change_column_null(:receivers, :last_name,        true)
    change_column_null(:receivers, :address_line_1,   true)
    change_column_null(:receivers, :birthday,         true)

    change_column_default(:receivers, :state,           nil)
    change_column_default(:receivers, :country,         nil)
    change_column_default(:receivers, :zip,             nil)
    change_column_default(:receivers, :address_line_2,  nil)
    change_column_default(:receivers, :city,            nil)
  end
end
