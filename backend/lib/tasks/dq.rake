namespace :dq do
  desc "gets a data ressourcre form dq api and displays it. parameter is the id of the resource"
  task :get_ressource, [:ressource_id] => :environment do |t, args|
    require 'net/http'
    require 'uri'

    id = args[:ressource_id]
    base_uri = URI("https://pab.donneesquebec.ca/api/3/action/datastore_search")
    query_params = { resource_id: id }
    uri = URI::HTTPS.build(host: base_uri.host, path: base_uri.path, query: query_params.to_query)
    response = Net::HTTP.get(uri)

    puts response
  end

  desc "creates a package with dq api with default parameters"
  task :create_package => :environment do |t|
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

  desc "creates a ressource inside a specific package with dq api with default parameters"
  task :create_ressource, [:package_id] => :environment do |t, args|
    require 'net/http'
    require 'uri'
    jeton_PAB = ENV.fetch("DQ_API_KEY")

    post_data = {
        package_id: args[:package_id],
        name: 'resssource_cree_api_test_brice',
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

    base_uri = URI("https://pab.donneesquebec.ca/api/3/action/resource_create")
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
