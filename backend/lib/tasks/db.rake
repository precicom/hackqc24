# reopen :db namespace
namespace :db do
  desc 'Check if the database exists'
  task exists: :environment do
    ActiveRecord::Base.connection
  rescue TinyTds::Error => e
    puts 'Database does not exists'
    exit 1
  else
    puts 'Database does exists'
    exit 0
  end
end
