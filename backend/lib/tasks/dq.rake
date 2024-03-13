require 'net/http'
require 'uri'

namespace :dq do
  # example usage: rake dq:get_ressource["170464b4-e31e-4666-9629-a3c82fea0ae1"]
  desc "gets a data ressourcre form dq api and displays it. parameter is the id of the resource"
  task :get_ressource, [:ressource_id] => :environment do |t, args|

    OpenDataManager::DQApiService.new.fetch_ressource_data(args[:ressource_id])
  end

  # example usage: rake dq:create_package
  desc "creates a package with dq api with default parameters"
  task :create_package => :environment do |t|

    post_data = {
      title: 'Résumés générés des séances du conseil municipal de Shawinigan',
      notes: 'Résumés des générés des a partir des vidéos des séances du conseil municipal de Shawinigan',
      update_frequency: 'asNeeded',
      ext_spatial: 'ville-shawinigan',
      owner_org: 'a494684c-3adb-45d9-ae7d-ef6908c98c6a',
      extras_organisation_principale: 'gouvernement-du-quebec',
      language: 'FR',
      license_id: 'cc-by',
      type: 'dataset',
      private: false,
      state: 'active',
      name: 'resumes_generes_conseil_municipal_shawinigan'
    }
    OpenDataManager::DQApiService.new.create_package(post_data)
  end

  # example usage: rake dq:create_ressource['brice-test-creation']
  desc "creates a ressource inside a specific package with dq api with default parameters"
  task :create_ressource, [:package_id] => :environment do |t, args|

    post_data = {
      package_id: args[:package_id],
      name: 'resssource_cree_api_test_brice2',
      description: 'Fichier CSV contenant xyz',
      taille_entier: 6,
      format:'CSV',
      resource_type: 'donnees',
      relidi_condon_valinc:'oui',
      relidi_condon_nombre:'n/a',
      relidi_condon_boolee:'oui',
      relidi_condon_datheu:'oui',
      relidi_confic_utf8:'oui',
      relidi_confic_separateur_virgule:'oui',
      relidi_confic_pascom:'n/a',
      relidi_confic_epsg:'n/a',
      url_type: 'upload',
      mimetype: 'text/csv',
      mimetype_inner: nil
    }

    OpenDataManager::DQApiService.new.create_ressource_data(post_data)
  end
end

namespace :youtube do
  # example usage: rake youtube:get_most_recent_video_url["https://www.youtube.com/playlist?list=PLA29-Xv4NCfaBcRljPD74I5CWyNYrvx1i"]
  # example usage: rake youtube:get_most_recent_video_url["https://www.youtube.com/playlist?list=PLA29-Xv4NCfaBcRljPD74I5CWyNYrvx1i", 20]
  desc "gets the most recents video url from youtube playlist, the parameters are the playlist url and the number of videos to fetch"
  task :get_most_recent_video_url, [:playlist_url, :number_of_videos] => :environment do |t, args|

    OpenDataManager::YoutubePlaylistFetcher.new.fetch_playlist(args[:playlist_url], args[:number_of_videos] || 10)
  end


end
