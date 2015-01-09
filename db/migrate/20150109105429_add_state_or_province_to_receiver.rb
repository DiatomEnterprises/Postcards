class AddStateOrProvinceToReceiver < ActiveRecord::Migration
  def change
  	add_column :receivers, :state_or_province, :string
  end
end
