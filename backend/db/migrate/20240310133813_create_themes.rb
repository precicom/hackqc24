class CreateThemes < ActiveRecord::Migration[7.1]
  def change
    create_table :themes do |t|
      t.string :name
      t.text :generated_summary
      t.integer :category
      t.timestamps
    end
  end
end
