class CreateUserVotes < ActiveRecord::Migration[7.1]
  def change
    create_table :user_votes do |t|
      t.references :user, null: false
      t.references :post, null: false
      t.boolean :is_downvote
      t.timestamps
    end
  end
end
