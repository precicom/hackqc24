require 'net/http'
require 'uri'

namespace :dq do
  # example usage: rake dq:get_package["resumes_generes_conseil_municipal_shawinigan"]
  desc "gets metadata of a package form dq api and displays it. parameter is the id of the package"
  task :get_package, [:package_id] => :environment do |t, args|

    response = OpenDataManager::DQApiService.new.fetch_package_data(args[:package_id])
    puts JSON.parse(response)
  end

  # example usage: rake dq:fetch_video_urls_from_dq_resource["1e5f2679-c029-40ad-9794-34e7afd41749"]
  desc "gets video urls from dq api and displays it. parameter is the id of the resource"
  task :fetch_video_urls_from_dq_resource, [:ressource_id] => :environment do |t, args|
    urls = OpenDataManager::DQOpenDataManager.fetch_video_urls_from_dq_resource(args[:ressource_id])
    puts urls
  end

  # example usage: rake dq:get_ressource["1e5f2679-c029-40ad-9794-34e7afd41749"]
  desc "gets a data ressourcre form dq api and displays it. parameter is the id of the resource"
  task :get_ressource, [:ressource_id] => :environment do |t, args|

    response = OpenDataManager::DQApiService.new.fetch_ressource_data(args[:ressource_id])
    puts JSON.parse(response)
  end

  # example usage: rake dq:create_package['Résumés générés des séances du conseil municipal de Shawinigan','resumes_generes_conseil_municipal_shawinigan','Résumés des séances du conseil municipal de Shawinigan générés par IA a partir des soutitre youtube','ville-shawinigan']
  desc "creates a package with dq api with the specified parameters and some default parameters"
  task :create_package, [:package_title, :package_name, :package_notes, :ext_spatial] => :environment do |t, args|

    post_data = {
      title: args[:package_title],
      notes: args[:package_notes],
      update_frequency: 'asNeeded',
      ext_spatial: args[:ext_spatial],
      owner_org: 'a494684c-3adb-45d9-ae7d-ef6908c98c6a',
      extras_organisation_principale: 'gouvernement-du-quebec',
      language: 'FR',
      license_id: 'cc-by',
      type: 'dataset',
      private: false,
      state: 'active',
      name: args[:package_name]
    }

    OpenDataManager::DQApiService.new.create_package(post_data)
  end

  # example usage: rake dq:populate_video_dataset_from_playlist["https://www.youtube.com/playlist?list=PLA29-Xv4NCfaBcRljPD74I5CWyNYrvx1i",videos_conseil_municipal_shawinigan]
  desc "populate a ressource inside a specific package within dq taking videos information form a specified youtube playlist"
  task :populate_video_dataset_from_playlist, [:playlist_url, :package_id] => :environment do |t, args|

    OpenDataManager::DQOpenDataManager.populate_video_dataset_from_playlist(args[:playlist_url],args[:package_id])
  end

  # example usage: rake dq:delete_ressource["c3a3e2e0-33ea-4cde-b916-10a8f9c714e7"]
  desc "delete a ressource from dq with id"
  task :delete_ressource, [:ressource_id] => :environment do |t, args|
    OpenDataManager::DQApiService.new.delete_ressource(args[:ressource_id])
  end
end


namespace :youtube do
  # example usage: rake youtube:get_most_recent_video_url["https://www.youtube.com/playlist?list=PLA29-Xv4NCfaBcRljPD74I5CWyNYrvx1i"]
  # example usage: rake youtube:get_most_recent_video_url["https://www.youtube.com/playlist?list=PLA29-Xv4NCfaBcRljPD74I5CWyNYrvx1i", 20]
  desc "gets the most recents video url from youtube playlist, the parameter is the playlist url"
  task :get_most_recent_video_url, [:playlist_url, :number_of_videos] => :environment do |t, args|

    snippet = OpenDataManager::YoutubePlaylistFetcher.new.fetch_playlist(args[:playlist_url],args[:number_of_videos] || 5)
    snippet.each do |snippet|
      puts "https://www.youtube.com/watch?v=#{snippet.resource_id.video_id}"
    end
  end
end
