class PostcardsController < ApplicationController
  respond_to :json, except: [:show, :create_pdf]

  def index
    if current_account.is_admin?
      receivers = Receiver.all.includes(:account)
      if params["start_date"] && params["end_date"]
        render json: receivers.where(birthday: params["start_date"]..params["end_date"]).to_json(methods: :email)
      else
        render json: receivers.to_json(methods: :email)
      end      
    else
      if params["start_date"] && params["end_date"]
        render json: current_account.receivers.where(birthday: params["start_date"]..params["end_date"])
      else
        render json: current_account.receivers
      end
    end
  end
  
  def create
    render json: current_account.receivers.create(postcard_params)
  end

  def update
    receiver = Receiver.find(params[:id])
    receiver.update(postcard_params)
    render json: receiver.to_json(methods: :email)
  end

  def show
    json_receivers = JSON.parse(params[:receivers])
    receiver_ids = json_receivers['receivers'].keys
    birthdays = json_receivers['receivers'].values

    render json: {link: create_pdf_postcards_path(receiver_ids: receiver_ids, birthdays: birthdays)}
  end

  def change_owner

  end

  def create_pdf
    @receivers = Receiver.find(params[:receiver_ids])
    @birthdays = params[:birthdays]

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
