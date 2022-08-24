Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root "my_blogs#index"
  resources :my_blogs do
    collection do
      get :test
    end
  end
  resources :front_ends do
    collection do
    end
  end
end
