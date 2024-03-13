# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


user = User.first
theme1 = Theme.create({
                        name: 'Réduction des ordures',
                        generated_summary: 'Protéger les générations futures en réduisants les ordures',
                        category: 'environnement'
                      })

Post.create({
              user_id: user.id,
              content_text: 'Mon voisin ne respecte pas les horaires de collecte des ordures',
              theme: theme1,
              status: 'accepted'
            })

# create various sets of Posts and Themes that are very distinct form each other
theme2 = Theme.create({
                        name: 'Sécurité routière',
                        generated_summary: 'Conseils pour conduire en toute sécurité',
                        category: 'service_police'
                      })

Post.create({
              user_id: user.id,
              content_text: 'Quelles sont les règles à respecter pour conduire en hiver?',
              theme: theme2,
              status: 'accepted'
            })

theme3 = Theme.create({
                        name: 'Alimentation saine',
                        generated_summary: 'Recettes pour des repas équilibrés',
                        category: 'loisirs_et_culture'
                      })

Post.create({
              user_id: user.id,
              content_text: 'Quels sont les aliments à privilégier pour une alimentation saine?',
              theme: theme3,
              status: 'accepted'
            })

theme4 = Theme.create({
                        name: 'Économie locale',
                        generated_summary: 'Promotion des commerces locaux',
                        category: 'developpement_economique'
                      })

Post.create({
              user_id: user.id,
              content_text: "Quels sont les avantages d'acheter local?",
              theme: theme4,
              status: 'accepted'
            })

theme5 = Theme.create({
                        name: 'Écoles primaires',
                        generated_summary: 'Conseils pour une éducation primaire réussie',
                        category: 'loisirs_et_culture'
                      })

Post.create({
              user_id: user.id,
              content_text: "Comment aider mon enfant à réussir à l'école?",
              theme: theme5,
              status: 'accepted'
            })

theme6 = Theme.create({
                        name: 'Tendances technologiques',
                        generated_summary: 'Dernières tendances technologiques',
                        category: 'developpement_economique'
                      })

Post.create({
              user_id: user.id,
              content_text: 'Quelles sont les nouvelles technologies à surveiller?',
              theme: theme6,
              status: 'accepted'
            })
