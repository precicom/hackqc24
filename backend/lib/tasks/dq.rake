namespace :dq do
  desc "gets a data ressourcre form dq api and displays it. parameter is the id of the resource"
  task :get, [:id] => :environment do |t, args|
    require 'net/http'
    require 'uri'

    id = args[:id]
    base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
    query_params = { resource_id: id }
    uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
    response = Net::HTTP.get(uri)

    puts response
  end

end
