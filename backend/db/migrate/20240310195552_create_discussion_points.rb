class CreateDiscussionPoints < ActiveRecord::Migration[7.1]
  def change
    create_table :discussion_points do |t|
      t.references :council, null: false
      t.references :theme, null: true
      t.string :title
      t.text :generated_summary
      t.string :minute_link_url
      t.timestamps
    end
  end
end
