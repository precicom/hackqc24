module OpenDataManager
  class DQOpenDataManager
    def self.fetch_video_urls_from_dq_resource(resource_id)
      # TODO : get video urls from the resouce id using DQ API : https://pab.donneesquebec.ca/api/3/action/datastore_search?resource_id=resource_id
    end

    def self.populate_video_dataset_from_playlist(playlist_url, package_id=nil)
      # TODO : get video urls from the playlist on youtube and populate the dataset using DQ API posting on url : https://pab.donneesquebec.ca/api/3/action/resource_create
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


      #create the ressource
      post_data = {
        package_id: package_id,
        name: 'resssource_cree_api_test_brice3',
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
      service_dq = DQApiService.new
      ressource_id = service_dq.create_ressource_data(post_data,"output.csv")
      puts ressource_id

    end
  end

  class DQApiService
    include HTTParty


    def fetch_ressource_data(ressource_id)
      id = ressource_id
      base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
      query_params = { resource_id: id }
      uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
      response = Net::HTTP.get(uri)

      #puts JSON.parse(response)['result']['resource_id']
    end

    def create_ressource_data(resource_data, csv_file_path)
      jeton_PAB = ENV.fetch("DQ_API_KEY")

      file_attachment = nil
      file_attachment = File.open(csv_file_path) if csv_file_path && File.exist?(csv_file_path)
      #mime_type = MIME::Types.type_for(csv_file_path).first.content_type

      post_data = resource_data
      post_data.merge!({upload: file_attachment}) if file_attachment
      puts post_data.to_json
      response = HTTParty.post("https://pab.donneesquebec.ca/api/3/action/resource_create",
        body: post_data.to_json,
        headers: {
          "Authorization" => jeton_PAB,
          "Connection" => "keep-alive"
        },
        multipart: true
      )

      #JSON.parse(response.body)['result']['id']
      puts response.code
      puts response.body
    end

    def update_ressource_data(ressource_id, resource_data, csv_file_path)
      jeton_PAB = ENV.fetch("DQ_API_KEY")

      post_data = resource_data
      file_content = File.read("path_to_your_file.csv")

      response = HTTParty.post("https://pab.donneesquebec.ca/api/3/action/resource_patch",
        body: post_data.to_json,
        headers: {
          "Authorization" => jeton_PAB,
          "Content-Type" => "application/json"
        }
      )

      JSON.parse(response.body)['result']['id']
      #puts response.code
      #puts response.body
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
