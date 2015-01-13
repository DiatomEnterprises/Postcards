class AddIsAdminToAccount < ActiveRecord::Migration
  def change
  	add_column :accounts, :is_admin, :boolean, default: false
  end
end
