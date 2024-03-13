module OpenDataManager
  class DQOpenDataManager
    def self.fetch_video_urls_from_dq_resource(resource_id)
      # TODO : get video urls from the resouce id using DQ API : https://pab.donneesquebec.ca/api/3/action/datastore_search?resource_id=resource_id
    end

    def self.populate_video_dataset_from_playlist(playlist_id, package_id)
      # TODO : get video urls from the playlist on youtube and populate the dataset using DQ API posting on url : https://pab.donneesquebec.ca/api/3/action/resource_create
    end
  end

  class DQApiService
    include HTTParty
    include URI
    def fetch_ressource_data(ressource_id)
      id = ressource_id
      base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
      query_params = { resource_id: id }
      uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
      response = Net::HTTP.get(uri)

      puts response
    end

    def create_ressource_data(resource_data)
      jeton_PAB = ENV.fetch("DQ_API_KEY")

      post_data = resource_data

      response = HTTParty.post("https://pab.donneesquebec.ca/api/3/action/resource_create",
        body: post_data.to_json,
        headers: {
          "Authorization" => jeton_PAB,
          "Content-Type" => "application/json"
        }
      )

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
      puts playlist_id
      result = youtube.list_playlist_items('snippet', playlist_id: playlist_id, max_results: number_of_videos)

      result.items.each do |item|
        video_id = item.snippet.resource_id.video_id
        video_url = "https://www.youtube.com/watch?v=#{video_id}"
        puts video_url
      end
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
