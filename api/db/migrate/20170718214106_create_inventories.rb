class CreateInventories < ActiveRecord::Migration[5.1]
  def change
    create_table :inventories do |t|
      t.datetime :date
      t.string :title
      t.string :hostname
      t.string :frame
      t.integer :order
      t.string :remoteip

      t.timestamps
    end
  end
end
