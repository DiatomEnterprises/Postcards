class PostcardsController < ApplicationController
  respond_to :json

  def index
    render json: current_account.receivers
  end
  
  def create
    render json: current_account.receivers.create(postcard_params)
  end

  def update
    receiver = Receiver.find(params[:id])
    render json:  receiver.update(postcard_params)
  end

  def show
    @receivers = Receiver.find(params[:receivers])
    # mm_in_inch = 25.4
    #   page_height = mm_in_inch*5.5
    #   page_width = mm_in_inch*8.5
    #   render  pdf: "postcard_#{params[:id]}",
    #           template: 'postcards/show.html.haml',
    #           layout: 'pdf',
    #           page_width: page_width,
    #           page_height: page_height
  end

  def change_owner

  end

  def create_pdf

  end

  def destroy
    render json:  Receiver.destroy(params[:id])
  end

  private

  def postcard_params
    params.require(:postcard).permit(:first_name, :last_name, :zip, :city, :country, :address_line_1, :address_line_2, :address_line_3, :account_id)
  end

end
