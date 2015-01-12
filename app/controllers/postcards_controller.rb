class PostcardsController < ApplicationController
  respond_to :json

  def index
    render json: Receiver.all
  end
  
  def create
    render json: Receiver.create(postcard_params)
  end

  def update
    render json:  Receiver.update(postcard_params)
  end

  def destroy
    render json:  Receiver.destroy(params[:id])
  end

  private

  def postcard_params
    params.require(:postcard).permit(:first_name, :last_name, :zip, :city, :country, :address_line_1, :address_line_2, :address_line_3)
  end

end
