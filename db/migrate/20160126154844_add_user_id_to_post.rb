class AddUserIdToPost < ActiveRecord::Migration
  def change
    add_column :posts, :user_id, :integer, null: false
    add_index :posts, :user_id
  end
end
