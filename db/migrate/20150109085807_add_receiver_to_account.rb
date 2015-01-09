class AddReceiverToAccount < ActiveRecord::Migration
  def change
  	add_column :receivers, :account_id, :integer
  end
end
