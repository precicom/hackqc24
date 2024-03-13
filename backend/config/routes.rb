Rails.application.routes.draw do
  resources :user_votes
  resources :comments do
    member do
      post :up_vote
      post :down_vote
    end
  end
  resources :councils
  resources :discussion_points

  resources :posts do
    collection do
      get :my_posts
    end

    member do
      get :comments
      post :up_vote
      post :down_vote
    end
  end

  resources :themes do
    collection do
      get :popular
    end
  end
  resources :users do
    collection do
      get :me
    end
  end

  post 'login', to: 'auth#create'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  root "rails/health#show"
end
