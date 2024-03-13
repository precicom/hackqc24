# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

user1 = User.create({
                      email: 'jacques_m16@hotmail.com'
                    })

user2 = User.create({
                      email: 'jacques_m17@hotmail.com'
                    })

theme1 = Theme.create({
                        name: 'gestion des ordures',
                        generated_summary: 'Marche à suivre pour émettre une plainte contre le voisin',
                        category: 'environnement'
                      })

Post.create({
              user_id: user1.id,
              content_text: 'Mon voisin ne respecte pas les horaires de collecte des ordures',
              theme: theme1,
              status: 'accepted'
            })

# create various sets of Posts and Themes that are very distinct form each other
theme2 = Theme.create({
                        name: 'sécurité routière',
                        generated_summary: 'Conseils pour conduire en toute sécurité',
                        category: 'urbanisme'
                      })

Post.create({
              user_id: user2.id,
              content_text: 'Quelles sont les règles à respecter pour conduire en hiver?',
              theme: theme2,
              status: 'accepted'
            })

theme3 = Theme.create({
                        name: 'alimentation saine',
                        generated_summary: 'Recettes pour des repas équilibrés',
                        category: 'greffe'
                      })

Post.create({
              user_id: user2.id,
              content_text: 'Quels sont les aliments à privilégier pour une alimentation saine?',
              theme: theme3,
              status: 'accepted'
            })

theme4 = Theme.create({
                        name: 'économie locale',
                        generated_summary: 'Promotion des commerces locaux',
                        category: 'developpement_economique'
                      })

Post.create({
              user_id: user2.id,
              content_text: "Quels sont les avantages d'acheter local?",
              theme: theme4,
              status: 'accepted'
            })

theme5 = Theme.create({
                        name: 'éducation',
                        generated_summary: 'Conseils pour une éducation réussie',
                        category: 'loisirs_et_culture'
                      })

Post.create({
              user_id: user2.id,
              content_text: "Comment aider mon enfant à réussir à l'école?",
              theme: theme5,
              status: 'accepted'
            })

theme6 = Theme.create({
                        name: 'technologie',
                        generated_summary: 'Dernières tendances technologiques',
                        category: 'developpement_economique'
                      })

Post.create({
              user_id: user2.id,
              content_text: 'Quelles sont les nouvelles technologies à surveiller?',
              theme: theme6,
              status: 'accepted'
            })
