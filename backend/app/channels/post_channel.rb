class PostChannel < ApplicationCable::Channel
  def subscribed
    stream_from "#post:#{params[:post_id]}"
  end

  def self.broadcast_message(post_id, type = '', message = {})
    ActionCable.server.broadcast("#post:#{post_id}", { post_id: post_id, data: message, type: type })
  end
end
