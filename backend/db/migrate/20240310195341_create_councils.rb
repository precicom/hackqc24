class CreateCouncils < ActiveRecord::Migration[7.1]
  def change
    create_table :councils do |t|
      t.string :title
      t.date :date
      t.string :youtube_link
      t.text :generated_summary
      t.timestamps
    end
  end
end
