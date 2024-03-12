rails_env = ENV.fetch('RAILS_ENV', 'development')

# Specify the environment Rails will run into
environment rails_env
if rails_env == 'development'
  threads 1, 1
  port 3000
else
  app_dir = '/app'

  t_per_w = ENV.fetch('PUMA_THREADS', 8).to_i
  threads t_per_w / 2, t_per_w

  bind 'tcp://0.0.0.0:80'

  preload_app!

  directory app_dir

  # disabled request logging
  quiet !ENV.fetch('PUMA_VERBOSE', false)
end
