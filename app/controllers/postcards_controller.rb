class PostcardsController < ApplicationController
  respond_to :json, except: [:show, :create_pdf]

  def index
    if current_account.is_admin?
      render json: Receiver.includes(:account)
    else  
      render json: current_account.receivers
    end
  end
  
  def create
    binding.pry
    render json: current_account.receivers.create(postcard_params)
  end

  def update
    receiver = Receiver.find(params[:id])
    render json:  receiver.update(postcard_params)
  end

  def show
    json_receivers = JSON.parse(params[:receivers])
    render json: {link: create_pdf_postcards_path(receiver_ids: json_receivers.values)}
  end

  def change_owner

  end

  def create_pdf
    @receivers = Receiver.find(params[:receiver_ids])
    mm_in_inch = 25.4
    page_height = mm_in_inch*5.5
    page_width = mm_in_inch*8.5
    render  pdf: "postcard_#{params[:id]}",
      template: 'postcards/show.html.haml',
      layout: 'pdf',
      page_width: page_width,
      page_height: page_height, 
      show_as_html: params[:debug],
      margin: {  top:     0,                     # default 10 (mm)
                 bottom:  0,
                 left:    0,
                 right:   "10mm"}

  end

  def destroy
    render json:  Receiver.destroy(params[:id])
  end

  private

  def postcard_params
    params.require(:postcard).permit(:first_name, :last_name, :zip, :city, :country, :address_line_1, :address_line_2, :address_line_3, :account_id, :birthday)
  end

end
