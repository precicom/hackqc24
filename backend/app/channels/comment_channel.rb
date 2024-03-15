class CommentChannel < ApplicationCable::Channel
  def subscribed
    stream_from "#comment:#{params[:comment_id]}"
  end

  def self.broadcast_message(comment_id, type = '', message = {})
    ActionCable.server.broadcast("#comment:#{comment_id}", {comment_id: comment_id, data: message, type: type })
  end
end
