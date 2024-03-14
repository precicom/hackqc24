module OpenDataManager
  class DQOpenDataManager
    def self.fetch_video_urls_from_dq_resource(resource_id)
      # TODO : get video urls from the resouce id using DQ API : https://pab.donneesquebec.ca/api/3/action/datastore_search?resource_id=resource_id
    end

    def self.populate_video_dataset_from_playlist(playlist_url, package_id)

      #create the ressource
      post_data = {
        package_id: package_id,
        name: 'videos_conseil_municipal',
        description: 'Fichier CSV contenant les liens vers les video de conseil municipal',
        taille_entier: 1,
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
        mimetype: 'text/csv'
      }
      service_dq = DQApiService.new
      ressource_id = service_dq.create_ressource_data(post_data)
      puts "Ressource #{ressource_id} created successfully"

      #get the list from youtube playlist
      snippets = YoutubePlaylistFetcher.new.fetch_playlist(playlist_url, 20)
      parsed_json = JSON.parse(snippets.to_json)

      #turn the list into a csv
      selected_properties = ['title','description','position','published_at','video_url']

      CSV.open('output.csv', 'w') do |csv|
        csv << selected_properties  # Access the keys of the first JSON object
        parsed_json.each do |obj|
          csv << selected_properties.map { |prop| prop == 'video_url' ? "https://www.youtube.com/watch?v=#{obj['resource_id']['video_id']}" : obj[prop] }
        end
      end

    end
  end

  class DQApiService
    # Fetches data for the given resource ID using an API call and returns the response.
    def fetch_ressource_data(ressource_id)
      base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
      query_params = { resource_id: ressource_id }
      uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
      response = Net::HTTP.get(uri)
    end

    #Create resource data in the API by making a POST request with the provided resource data. Returns the ID of the newly created resource.
    def create_ressource_data(resource_data)
      url_resource_create = "https://pab.donneesquebec.ca/recherche/api/3/action/resource_create"
      file_ressource = 'output.csv'
      response = rest_client_post_with_file(url_resource_create, resource_data, file_ressource)

      puts response.body
    end

    # Create a package using the provided package data by sending a POST request to the specified URL.
    def create_package(package_data)
      url_package_create = "https://pab.donneesquebec.ca/api/3/action/package_create"

      response = rest_client_post_with_file(url_package_create, package_data)

      puts response.body
    end

    private

    #This function sends a POST request to a specified URL using RestClient with optional file upload.
    def rest_client_post_with_file(url, attributes_hash, file_path=nil)
      headers = { 'Authorization' => ENV.fetch("DQ_API_KEY")}
      payload = attributes_hash
      payload.merge!({ 'upload' => File.new(file_path, 'rb')}) unless file_path.blank?
      response = RestClient.post(url, payload, headers)
    end
  end

  class YoutubePlaylistFetcher
    include Google::Apis::YoutubeV3

    # Fetches a playlist from the given URL with the specified number of videos.
    def fetch_playlist(playlist_url, number_of_videos)
      api_key = ENV.fetch("YT_API_KEY")

      youtube = Google::Apis::YoutubeV3::YouTubeService.new
      youtube.key = api_key

      playlist_id = extract_playlist_id(playlist_url)
      result = youtube.list_playlist_items('snippet', playlist_id: playlist_id, max_results: number_of_videos)
      snippets = result.items.map { |item| item.snippet }
    end

    private

    # Extracts the playlist ID from the given playlist URL.
    def extract_playlist_id(playlist_url)
      uri = URI.parse(playlist_url)
      query = URI.decode_www_form(uri.query || "")
      params = Hash[query]
      params['list']
    end
  end
end
