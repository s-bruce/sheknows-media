class InventoriesController < ApplicationController
	skip_before_action :verify_authenticity_token

  def create
    inventory = Inventory.create(inventory_params)
    # This works when I create a new record from the console
    # I wasn't able to properly format the params on the frontend
  end
 
  private
  
  def inventory_params
    params.require(:inventory).permit(:date, :title, :hostname, :frame, :order, :remoteip)
  end

end