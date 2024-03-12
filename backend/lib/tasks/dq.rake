namespace :dq do
  desc "gets a data ressourcre form dq api and displays it. parameter is the id of the resource"
  task :get_ressource, [:id] => :environment do |t, args|
    require 'net/http'
    require 'uri'

    id = args[:id]
    base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
    query_params = { resource_id: id }
    uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
    response = Net::HTTP.get(uri)

    puts response
  end

  desc "creates a package with dq api with default parameters"
  task :create_package, [] => :environment do |t, args|
    require 'net/http'
    require 'uri'
    jeton_PAB = ENV.fetch("DQ_API_KEY")

    post_data = {
      title: 'brice test creation',
      notes: 'A long description of my dataset',
      update_frequency: 'asNeeded',
      ext_spatial: 'cm-montreal',
      owner_org: 'a494684c-3adb-45d9-ae7d-ef6908c98c6a',
      extras_organisation_principale: 'gouvernement-du-quebec',
      language: 'FR',
      license_id: 'cc-by',
      type: 'dataset',
      private: false,
      state: 'active',
      name: 'brice-test-creation'
    }

    base_uri = URI("https://pab.donneesquebec.ca/api/3/action/package_create")
    request = Net::HTTP::Post.new(base_uri)
    request.body = post_data.to_json
    request['Authorization'] = jeton_PAB
    request['Content-Type'] = 'application/json'
    request['Connection'] = 'keep-alive'

    http = Net::HTTP.new(base_uri.host, base_uri.port)
    http.use_ssl = true

    response = http.request(request)

    puts response.code
    puts response.body

    end
end
