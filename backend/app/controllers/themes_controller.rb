class ThemesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[index show]

  def index
    themes = Theme.all
    scores = get_themes_scores

    themes.each do |t|
      t.score = scores[t.id.to_s] || 0
    end

    render json: themes, status: :ok
  end

  def popular
    scores = get_themes_scores
 
    theme_ids = scores.sort_by{|k,v| v}.reverse.map { |e| e.first.to_i }.slice(0,5) # On garde les 5 thèmes plus importants

    themes = Theme.find(theme_ids)

    themes.each do |t|
      t.score = scores[t.id.to_s] || 0
    end

    render json: themes, status: :ok
  end

  def create
    themes = Theme.new(permitted_params)
    if themes.save
      render json: themes, status: :created
    else
      render json: { error: 'Failed to create a Theme' },
             status: :not_acceptable
    end
  end

  def show
    themes = Theme.find(params[:id])
    render json: themes, status: :ok
  end

  def update
    themes = Theme.find(params[:id])
    if themes.update(permitted_params)
      render json: themes, status: :ok
    else
      render json: { error: 'Failed to update a theme' },
             status: :not_acceptable
    end
  end

  def destroy
    themes = Theme.find(params[:id])
    if themes.destroy
      render json: { message: 'Theme has been desroyed' }, status: :ok
    else
      render json: { error: 'Failed to destroy theme' },
             status: :not_acceptable
    end
  end

  private

  def permitted_params
    params.permit(:name, :generated_summary, :category)
  end

  def get_themes_scores
   scores = {}

   # Chaque commentaire donne 1 point au thème et chaque vote donne 0.5 point au thème.
    post_votes_comments = Post.joins("LEFT OUTER JOIN comments on (posts.id = comments.post_id AND comments.created_at > '#{1.month.ago}')", "LEFT OUTER JOIN user_votes on (posts.id = user_votes.reference_id AND user_votes.reference_type = 'Post' AND user_votes.created_at > '#{1.month.ago}')")
                    .select('posts.theme_id, count(distinct comments.id) AS comments_count, count(distinct user_votes.id) AS votes_count')
                    .where('posts.created_at > :start OR comments.created_at > :start OR user_votes.created_at > :start', start: 1.month.ago)
                    .group('posts.theme_id')
    post_votes_comments.each do |p_v_c|
      weighted = p_v_c.comments_count + p_v_c.votes_count * 0.5
      scores[p_v_c.theme_id.to_s] = weighted
    end

    # Chaque Post de la dernière semaine donne 3 point à son thème
    post_scores = Post.select('theme_id, count(*) as score').where('created_at > ?', 1.week.ago).group('posts.theme_id')
    post_scores.each do |p_s|
      weighted = p_s.score * 3
      if !scores[p_s.theme_id.to_s]
         scores[p_s.theme_id.to_s] = weighted
      else
         scores[p_s.theme_id.to_s] += weighted
      end
    end

    # Chaque DiscussionPoint du dernier conseil donne 3 point à son thème
    dp_scores = Council.order('date DESC').first.discussion_points.select('theme_id, count(*) as score').group('theme_id')
    dp_scores.each do |dp_s|
      weighted = dp_s.score * 3
      if !scores[dp_s.theme_id.to_s]
         scores[dp_s.theme_id.to_s] = weighted
      else
         scores[dp_s.theme_id.to_s] += weighted
      end
    end

    scores
  end
end
