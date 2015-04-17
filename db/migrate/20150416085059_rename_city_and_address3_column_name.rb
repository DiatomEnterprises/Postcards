class RenameCityAndAddress3ColumnName < ActiveRecord::Migration
  def up
    change_table :receivers do |t|
      t.rename :city, :state
      t.rename :address_line_3, :city
    end

    remove_column :receivers, :state_or_province
  end

  def down
    change_table :receivers do |t|
      t.rename :city, :address_line_3
      t.rename :state, :city
    end

    add_column :receivers, :state_or_province, :string
  end
end
