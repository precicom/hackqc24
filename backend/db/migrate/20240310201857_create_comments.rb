class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.references :user, null: false
      t.references :post, null: false
      t.text :content_text
      t.integer :status
      t.text :rejection_reason
      t.timestamps
    end
  end
end
