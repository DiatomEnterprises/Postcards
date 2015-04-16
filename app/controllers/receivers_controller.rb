class ReceiversController < ApplicationController
  respond_to :json, except: [:show, :create_pdf]

  def index
    @receivers = ReceiversPresenter.new(params, current_account).list
  end
  
  def create
    @receiver = current_account.receivers.new(receiver_params)
    if @receiver.save
      @receiver
    else
      render_failure(@receiver.errors.full_messages)
    end
  end

  def update
    @receiver = Receiver.find(params[:id])
    @receiver.is_deleted = false unless @receiver.account_id == receiver_params['account_id'].to_i
    if @receiver.update(receiver_params)
      @receiver
    else
      render_failure(@receiver.errors.full_messages)
    end
  end

  def update_owners
    if params['current_account_id'] != params['new_account_id']
      params['current_account_id'] = nil if params['current_account_id'] == ''
      @receiver = Receiver.where(account_id: params['current_account_id']).update_all(account_id:  params['new_account_id'])
      
      render_failure(['No receivers were updated!']) if @receiver == 0
    else
      render_failure(["Can't transfer contacts to the same account!"])
    end
  end

  def destroy
    @receiver = Receiver.find(params[:id])
    if current_account.is_admin?
      render_failure(@receiver.errors.full_messages) if !@receiver.destroy
    else
      render_failure(@receiver.errors.full_messages) if !@receiver.update(is_deleted: true)
    end
  end

  def show
    json_receivers = JSON.parse(params[:receivers])
    receiver_data = json_receivers.values

    render json: {link: create_pdf_receivers_path(receiver_data: receiver_data, birthday: params['birthday'])}
  end

  def create_pdf
    receiver_data = params[:receiver_data].map {|x| {x['id'] => x['info'] }}.reduce(:merge)

    @receivers = Receiver.find(receiver_data.keys)
    @receivers.map! {|x| x.additional_info = receiver_data[x.id.to_s]; x}
    @birthday = params[:birthday]

    mm_in_inch = 25.4
    page_height = mm_in_inch*5.5
    page_width = mm_in_inch*8.5
    render  pdf: "postcard_#{params[:id]}",
      template: 'receivers/show.html.haml',
      layout: 'pdf',
      page_width: page_width,
      page_height: page_height, 
      show_as_html: params[:debug],
      margin: {  top:     0,                     # default 10 (mm)
                 bottom:  0,
                 left:    0,
                 right:   "10mm"}

  end

  private

  def receiver_params
    params.require(:receiver).permit(:first_name, :last_name, :zip, :state, :country, :address_line_1, :address_line_2, :city, :account_id, :birthday)
  end

end
