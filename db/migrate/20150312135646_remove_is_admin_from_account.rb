class RemoveIsAdminFromAccount < ActiveRecord::Migration
  def up
    remove_column :accounts, :is_admin, :boolean
    add_column :accounts, :roles, :string, array: true, default: []
  end

  def down
    add_column :accounts, :is_admin, :boolean, default: false
    remove_column :accounts, :roles, :string, array: true, default: []
  end
end
