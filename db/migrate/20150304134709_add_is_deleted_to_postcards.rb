class AddIsDeletedToPostcards < ActiveRecord::Migration
  def change
    add_column :receivers, :is_deleted, :boolean, default: false
  end
end
