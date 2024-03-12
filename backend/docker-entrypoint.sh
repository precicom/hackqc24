#!/bin/bash

set -e

if bundle exec rake db:exists; then
  bundle exec rake db:migrate
else
  bundle exec rake db:create
  bundle exec rake db:migrate
  bundle exec rake db:seed
fi

case $1 in

  web)
    exec bundle exec puma -C config/puma.rb
  ;;

  # bgtasks)
  #   exec bundle exec rake bgtasks:run
  # ;;

  *)
    exec "$@"
  ;;
esac

exit 0