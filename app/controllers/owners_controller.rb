class OwnersController < ApplicationController

	def update
		receivers = Receiver.where(account_id: params["current_account_id"])
		receivers.each do |receiver|
			receiver.update_attribute(:account_id, params["new_account_id"])
		end
		render json: :ok
	end

end
