class Theme < ApplicationRecord
  has_many :posts
  has_many :discussion_points

  attr_accessor :score

  enum :category, {
    achats: 1,
    legislation: 2,
    direction_generale: 3,
    developpement_economique: 4,
    service_police: 5,
    securite_incendie: 6,
    travaux_publics: 7,
    environnement: 8,
    urbanisme: 9,
    loisirs_et_culture: 10
  }

  CATEGORIES_DESCRIPTIONS = {
    territoire: 'Territoire de la ville, la faune, la flore et les espaces entourant la ville',
    achats: "Achats et décisions d'achat",
    legislation: 'Lois, règlements et autres sujets juridiques',
    direction_generale: 'Gestion de la ville, employés de la ville et bureaucratie',
    developpement_economique: 'Sujets économiques ou ayant un impact sur les entreprises',
    service_police: 'Service de police de la ville et crimes',
    securite_incendie: "Risques de feu, d'incendies, réponses aux incidents sur la route",
    travaux_publics: 'Travaux routiers et travaux sur les infrastructures de la ville',
    environnement: 'Sujets environnementaux, impact sur le climat',
    urbanisme: 'Parcs, installations communautaires, bâtiments résidentiels',
    loisirs_et_culture: 'Activités sportives, terrains de sports, arénas, évènements organisées par la ville et ses citoyens, religion'
  }.freeze

  def self.category_description(category)
    CATEGORIES_DESCRIPTIONS[category.to_sym]
  end

  # This version return the top 5 themes in no particular order with the most total amount of comments and upvotes (downvotes are not considered)
  def self.popupar_themes_v1
    theme_ids = Post
                .select('posts.theme_id')
                .joins("LEFT JOIN user_votes ON user_votes.reference_id = posts.id AND user_votes.reference_type = 'Post' AND user_votes.is_downvote = false")
                .joins('LEFT JOIN comments ON comments.post_id = posts.id')
                .group('posts.id')
                .order(Arel.sql("SUM(DISTINCT user_votes.id) + COUNT(DISTINCT comments.id) DESC"))
                .limit(100)
                .distinct
                .pluck('posts.theme_id')
                .take(5)

    Theme.where(id: theme_ids)
  end
end
