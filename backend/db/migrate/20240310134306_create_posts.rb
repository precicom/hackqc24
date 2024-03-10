class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :user
      t.references :theme
      t.text :content_text
      t.integer :status
      t.text :rejection_reason
      t.timestamps
    end
  end
end
