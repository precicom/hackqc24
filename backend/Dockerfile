ARG DEPENDENCY_PROXY=docker.io
FROM ${DEPENDENCY_PROXY}/ruby:3.2.2-bullseye

WORKDIR /app
COPY Gemfile ./Gemfile
COPY Gemfile.lock ./Gemfile.lock
RUN bundle install -j 4

COPY . .

# entrypoint
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENV RAILS_LOG_TO_STDOUT=true
ENTRYPOINT ["/entrypoint.sh"]

CMD ["web"]
EXPOSE 80