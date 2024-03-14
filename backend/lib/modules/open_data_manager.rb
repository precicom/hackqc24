module OpenDataManager
  class DQOpenDataManager
    def self.fetch_video_urls_from_dq_resource(resource_id)
      # TODO : get video urls from the resouce id using DQ API : https://pab.donneesquebec.ca/api/3/action/datastore_search?resource_id=resource_id
    end

    def self.populate_video_dataset_from_playlist(playlist_url, package_id=nil)
      # TODO : get video urls from the playlist on youtube and populate the dataset using DQ API posting on url : https://pab.donneesquebec.ca/api/3/action/resource_create
      #create the ressource
      post_data = {
        'package_id'=> package_id,
        'name'=> 'resssource_cree_api_test_brice5',
        'description'=> 'Fichier CSV contenant xyz',
        'taille_entier'=> 1,
        'format'=>'CSV',
        'resource_type'=> 'donnees',
        'relidi_condon_valinc'=>'oui',
        'relidi_condon_nombre'=>'n/a',
        'relidi_condon_boolee'=>'oui',
        'relidi_condon_datheu'=>'oui',
        'relidi_confic_utf8'=>'oui',
        'relidi_confic_separateur_virgule'=>'oui',
        'relidi_confic_pascom'=>'n/a',
        'relidi_confic_epsg'=>'n/a',
        'url_type'=> 'upload',
        'mimetype'=> 'text/csv'
      }
      service_dq = DQApiService.new
      ressource_id = service_dq.create_ressource_data(post_data)
      #puts "#{ressource_id} created successfully"

      #get the list from youtube playlist
      snippets = YoutubePlaylistFetcher.new.fetch_playlist(playlist_url, 20)
      parsed_json = JSON.parse(snippets.to_json)

      #turn the list in csv
      selected_properties = ['title','description','position','published_at','video_url']

      CSV.open('output.csv', 'w') do |csv|
        csv << selected_properties  # Access the keys of the first JSON object
        parsed_json.each do |obj|
          csv << selected_properties.map { |prop| prop == 'video_url' ? "https://www.youtube.com/watch?v=#{obj['resource_id']['video_id']}" : obj[prop] }
        end
      end

      #update the ressource with the csv
      #service_dq.update_ressource_csv(ressource_id,"output.csv")

      #delete the csv
      #File.delete("output.csv")

    end
  end

  class DQApiService
    include HTTParty

    # Fetches data for the given resource ID using an API call and returns the response.
    def fetch_ressource_data(ressource_id)
      id = ressource_id
      base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
      query_params = { resource_id: id }
      uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
      response = Net::HTTP.get(uri)

      #puts JSON.parse(response)['result']['resource_id']
    end

    #Create resource data in the API by making a POST request with the provided resource data. Returns the ID of the newly created resource.
    def create_ressource_data(resource_data)
      jeton_PAB = ENV.fetch("DQ_API_KEY")

      jeton_PAB = ENV.fetch("DQ_API_KEY")
      url_resource_patch = "https://pab.donneesquebec.ca/recherche/api/3/action/resource_create"
      uri = URI.parse(url_resource_patch)

      file_ressource = 'output.csv'

      file = File.open(file_ressource, "rb")

      post_header = { "Authorization" => jeton_PAB }

      request = Net::HTTP::Post.new(uri, post_header)
      form_data = [['file', file]]
      resource_data.each { |key, value| form_data << [key, value] }
      puts form_data
      request.set_form(form_data, 'multipart/form-data')

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
        http.request(request)
      end


      puts response.body

      # response = HTTParty.post("https://pab.donneesquebec.ca/api/3/action/resource_create",
      #   body: post_data.to_json,
      #   headers: {
      #     "Authorization" => jeton_PAB,
      #     "Connection" => "keep-alive"
      #   }
      # )
      # puts response.code
      # puts response.body
      # JSON.parse(response.body)['result']['id']

    end

    # Updates a resource CSV file. Args: ressource_id [String] The ID of the resource to update; csv_file_path [String] The path to the CSV file to update.
    def update_ressource_csv(ressource_id, csv_file_path)
      require 'net/http'
      require 'uri'

      jeton_PAB = ENV.fetch("DQ_API_KEY")
      url_resource_patch = "https://pab.donneesquebec.ca/recherche/api/3/action/resource_patch"
      uri = URI.parse(url_resource_patch)

      file_ressource = csv_file_path
      resource_id_to_update = ressource_id

      file = File.open(file_ressource, "rb")

      post_header = { "Authorization" => jeton_PAB }

      request = Net::HTTP::Post.new(uri, post_header)
      form_data = [['id', resource_id_to_update],['file', file]]
      request.set_form(form_data, 'multipart/form-data')

      #puts request.body

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
        http.request(request)
      end

      puts response.body
      response = request.post

      if response.code == '200'
        puts 'Ressource MAJ avec succès.'
      else
        puts "Erreur lors de la modification de la ressource: #{response.body}"
        raise Exception, response.body
      end
        puts response.code
        puts response.body
    end

    def create_package(package_data)
      jeton_PAB = ENV.fetch("DQ_API_KEY")

      post_data = package_data

      response = HTTParty.post("https://pab.donneesquebec.ca/api/3/action/package_create",
        body: post_data.to_json,
        headers: {
          "Authorization" => jeton_PAB,
          "Content-Type" => "application/json"
        }
      )

      puts response.code
      puts response.body
    end
  end

  class YoutubePlaylistFetcher
    include Google::Apis::YoutubeV3

    def fetch_playlist(playlist_url, number_of_videos = 10)
      api_key = ENV.fetch("YT_API_KEY")

      youtube = Google::Apis::YoutubeV3::YouTubeService.new
      youtube.key = api_key

      playlist_id = extract_playlist_id(playlist_url)
      result = youtube.list_playlist_items('snippet', playlist_id: playlist_id, max_results: number_of_videos)
      snippets = result.items.map { |item| item.snippet }
    end

    private

    def extract_playlist_id(playlist_url)
      uri = URI.parse(playlist_url)
      query = URI.decode_www_form(uri.query || "")
      params = Hash[query]
      params['list']
    end
  end
end
