class PostcardsController < ApplicationController
  def index
    @receivers = Receiver.limit(5)
  end

  def new
    if params[:id]
      @receiver = Receiver.find(params[:id])
    else
      @receiver = Receiver.new
    end
  end

  def create
    @receiver = Receiver.where(
          first_name: params[:receiver][:first_name], 
          last_name: params[:receiver][:last_name], 
          address_line_1: params[:receiver][:address_line_1]
          ).first_or_create(postcard_params)
    redirect_to action: 'show', id: @receiver.id
  end

  def update_receiver
    @receiver = Receiver.find(params[:receiver][:id])
    @receiver.update_attributes(postcard_params)
    redirect_to action: 'show', id: @receiver.id
  end

  def show
    @receiver = Receiver.find(params[:id])
    mm_in_inch = 25.4
    page_height = mm_in_inch*5.5
    page_width = mm_in_inch*8.5
    render  pdf: "postcard_#{params[:id]}",
            template: 'postcards/show.html.haml',
            layout: 'pdf.html',
            # dpi: dpi.to_s,    
            page_width: page_width,       
            page_height: page_height
    # render layout: "pdf"
  end

  def receivers
    if !params[:first_name].empty? || !params[:last_name].empty?
      
      if !params[:first_name].empty?
        @receivers = Receiver.where("(first_name LIKE ?)", "%#{params[:first_name]}%")
      else
        @receivers = Receiver.all
      end

      if !params[:last_name].empty?
        @receivers = @receivers.where( "(last_name LIKE ?)", "%#{params[:last_name]}%")
      end
    end

    render json: @receivers.to_json
  end

  private
    def postcard_params
      params.require(:receiver).permit(:first_name, :last_name, :zip, :city, :country, :address_line_1, :address_line_2, :address_line_3)
    end
end
