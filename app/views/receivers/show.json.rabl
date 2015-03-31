object @receiver
attribute :id, :first_name, :last_name, :city, :country, :zip, :address_line_1, :address_line_2, :address_line_3, :account_id, :birthday

if current_account.is_admin?
  node(:is_deleted) { |receiver| receiver.is_deleted }

  node(:email) do |receiver|
    if receiver.account_id > 0
      receiver.email
    else
      'undefined'
    end
  end
end