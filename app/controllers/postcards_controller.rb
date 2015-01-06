class PostcardsController < ApplicationController
  def index
  end

  def new
    if params[:id]
      @receiver = Receiver.find(params[:id])
    else
      @receiver = Receiver.new
    end
  end

  def create
    @receiver = Receiver.create(postcard_params)
    redirect_to action: 'show', id: @receiver.id
  end

  def show
    @receiver = Receiver.find(params[:id])
    dpi = 75
    page_height = dpi*5.5
    page_width = dpi*8.5
    render  pdf: "postcard_#{params[:id]}",
            template: 'postcards/show.html.haml',
            layout: 'pdf',
            dpi: dpi.to_s,    
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

    puts @receivers.inspect
    render json: @receivers.to_json
  end

  private
    def postcard_params
      params.require(:receiver).permit(:first_name, :last_name, :zip, :city, :country, :address_line_1, :address_line_2, :address_line_3)
    end
end
