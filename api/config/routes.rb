Rails.application.routes.draw do
  resources :inventories, only: [:create]
end
