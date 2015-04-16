class RenameCityAndAddress3ColumnName < ActiveRecord::Migration
  def change
    change_table :receivers do |t|
      t.rename :city, :state
      t.rename :address_line_3, :city
    end
  end

  def up
    remove_column :receivers, :state_or_province
  end

  def down
    add_column :receivers, :state_or_province, :string
  end
end
