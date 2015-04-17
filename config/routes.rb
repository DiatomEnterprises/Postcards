Rails.application.routes.draw do

  devise_for :accounts, :skip => [:registrations]
  root 'main_page#index'

  resources :receivers do
    collection do
      get 'pdf_create'
      get 'pdf_templates'
      put 'update_owners'
    end
  end

  resources :accounts do
    collection do
      get 'get_roles'
    end
  end
  
  resources :main_page do
    get 'accounts'
  end
end
