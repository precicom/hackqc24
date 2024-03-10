class CreateDiscussionPoints < ActiveRecord::Migration[7.1]
  def change
    create_table :discussion_points do |t|
      t.references :theme
      t.text :generated_summary
      t.integer :council_id
      t.text :minute_link_url
      t.timestamps
    end
  end
end
