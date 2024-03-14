# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

user = User.create!(email: 'master_cado@hotmail.com')

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


# Conseils
conseil1 = Council.create!({
title: "Séance publique du 16 janvier 2024, 19 h",
date: 'Tue, 16 Jan 2024',
youtube_link: "https://www.youtube.com/watch?v=ROPkX5trQ20",
generated_summary: nil
})

discussion_points1 = [{title: 'Adoption du Règlement SH 731', generated_summary: 'Approbation d\'un emprunt et d\'une dépense pour des études scientifiques.'},{title: 'Dépôt des Listes de Dépenses Autorisées', generated_summary: 'Présentation des dépenses autorisées en décembre 2023 et des contrats de plus de 25000.'},{title: 'Déclaration d\'Intérêt Pécuniaire', generated_summary: 'Dépôt des déclarations d\'intérêt pécuniaire par les membres du conseil.'},{title: 'Nomination de la Directrice Générale Adjointe', generated_summary: 'Nomination de Kim Dumet comme directrice générale adjointe.'},{title: 'Embauche Chef Prévention Sécurité Civile', generated_summary: 'Embauche de Denis Gilino au service de la sécurité incendie.'},{title: 'Signature Contrat Conseiller Stratégique', generated_summary: 'Contrat de travail avec François Saint-Onge comme conseiller stratégique.'},{title: 'Renouvellement Contrat Service d\'Entretien', generated_summary: 'Renouvellement des contrats d\'entretien ménager pour 2024.'},{title: 'Contrat Location Personnel Station Traitement Eau', generated_summary: 'Conclusion d\'un contrat avec Nordico pour la station de traitement de l\'eau.'},{title: 'Entente Centre d\'Entrepreneuriat Chigan', generated_summary: 'Signature de l\'entente de financement avec Chigan Coopérative de solidarité.'},{title: 'Adoption Plan d\'Intégration Personnes Handicapées', generated_summary: 'Adoption du bilan 2023 et du plan d\'action 2024 pour l\'intégration des personnes handicapées.'},{title: 'Contribution Financière Développement de Chigan', generated_summary: 'Versement de 125667 dollars pour le développement de Chigan en 2024.'},{title: 'Engagement Budgétaire Programme Rénovation Québec', generated_summary: 'Demande de fonds de 100000 dollars pour le programme rénovation.'},{title: 'Subvention Société d\'Habitation du Québec', generated_summary: 'Versement de subventions pour la rénovation.'},{title: 'Analyse Sécurité Intersection Boulevard Chigan Sud', generated_summary: 'Demande d\'analyse de sécurité au ministère des Transports.'},{title: 'Autorisation Passage Motoneige', generated_summary: 'Autorisation pour le passage des motoneiges lors du Grand Prix snowcross Chigan.'},{title: 'Annonces des Prochaines Séances', generated_summary: 'Dates des prochaines séances ordinaire et extraordinaire.'}]
discussion_points1.each do |d|
  puts "Processing: #{d[:title]}..."
  conseil1.discussion_points.create!(d)
end

conseil2 = Council.create!({
  title: "Séance publique du 13 février 2024, 19 h",
  date: 'Tue, 13 Feb 2024',
  youtube_link: "https://www.youtube.com/watch?v=sc437zd7Km4",
  generated_summary: nil})

discussion_points2 = [{title: "Sensibilisation au Décrochage Scolaire", generated_summary: "Mise en lumière de la semaine sur le décrochage scolaire et des activités prévues, notamment à Trois Rivières."},{title: "Adoption des Procès-Verbaux", generated_summary: "Adoption unanime des procès-verbaux des séances ordinaire et extraordinaire."},{title: "Approbation des Règlements SH 726 à SH 730", generated_summary: "Règlements réputés approuvés par les personnes habiles à voter."},{title: "Dépôt des Listes de Dépenses et Contrats", generated_summary: "Présentation des dépenses autorisées et des contrats de plus de 25 000 dollars."},{title: "Rapports d'Activité du Trésorier et Modifications Organisationnelles", generated_summary: "Confirmation des rapports d'activité et approbation des modifications organisationnelles pour 2024."},{title: "Nominations", generated_summary: "Nomination de plusieurs individus à des postes clés au sein de l'administration municipale."},{title: "Contrats d'Assistance Technique et de Réparation de Pavage", generated_summary: "Autorisation de contrats pour l'extraction de données et la réparation de pavage."},{title: "Aménagement d'une Aire de Jeu d'Eau", generated_summary: "Adoption d'un système de pondération pour l'évaluation des offres pour l'aménagement d'une aire de jeu d'eau."},{title: "Projets d'Emprunt et de Réfection d'Infrastructures", generated_summary: "Présentation d'un avis de motion pour un emprunt de 2 millions et adoption de règlements autorisant des emprunts pour la réfection d'infrastructures."},{title: "Politique pour un Vieillissement Actif", generated_summary: "Adoption de la politique pour un vieillissement actif 2024-2026 et création d'un comité de suivi."},{title: "Support Financier et Cautionnement", generated_summary: "Cautionnement en faveur de la Société de développement et demande d'aide financière pour le Programme d'infrastructure municipale d'eau."},{title: "Versement de Subventions", generated_summary: "Autorisation du versement de subventions dans le cadre de différents programmes et pour divers bénéficiaires."},{title: "Représentations de la Ville", generated_summary: "Autorisation de représentations de la ville lors de divers événements et conférences."}]
discussion_points2.each do |d|
  conseil2.discussion_points.create!(d)
end

conseil3 = Council.create!({
  title: "Séance publique du 5 mars 2024, 19 h",
  date: 'Tue, 05 Mar 2024',
  youtube_link: "httphttps://www.youtube.com/watch?v=RnuA9r63KQ0",
  generated_summary: nil})

discussion_points3 = [{title: "Nomination du Trésorier et Directeur des Finances", generated_summary: "Gabriel Bonwin est nommé trésorier et directeur du Service des finances."},{title: "Entente de Prestation de Rente Progressive", generated_summary: "Autorisation d'une entente de prestation de rente progressive pour les employés syndiqués."},{title: "Convention d'Aide Financière pour la Transition Climatique", generated_summary: "Signature d'une convention d'aide financière pour accélérer la transition climatique locale."},{title: "Plan Régional des Milieux Humides et Hydriques", generated_summary: "Prolongation du contrat pour les services professionnels concernant le plan régional des milieux humides et hydriques."},{title: "Étude sur l'Impact du Prélèvement d'Eau", generated_summary: "Attribution d'un contrat à la firme Delle Desgan Massé et associé pour une étude scientifique sur l'évaluation des impacts du prélèvement de l'eau brute."},{title: "Nettoyage des Conduites d'Égouts", generated_summary: "Octroi d'un contrat à EBI Envirotch Inc. pour le nettoyage des conduites des égouts."},{title: "Mesure de Débit pour la Gestion des Débordements", generated_summary: "Confiance d'une campagne de mesure de débit à Avisau Expert Conseil pour le plan de gestion des débordements."},{title: "Renouvellement de Contrat pour le Traitement des Eaux Résiduaires", generated_summary: "Approbation du renouvellement du contrat pour le service de location et d'opération d'une unité de traitement des eaux résiduaires."},{title: "Renouvellement de Contrat pour la Reconstruction de Bordures et Trottoirs", generated_summary: "Renouvellement du contrat accordé à 90394701 Québec Inc. pour la reconstruction de bordures et de trottoirs."},{title: "Modification du Règlement sur les Nuisances Environnementales", generated_summary: "Présentation du règlement SH 1.107 modifiant le règlement général sur les nuisances environnementales et la tarification."},{title: "Adoption de Règlement pour Réfection de Pavage", generated_summary: "Adoption du règlement SH736 pour des travaux de réfection de pavage."},{title: "Emprunt pour Réfection d'Aqueduc, d'Égout et de Voirie", generated_summary: "Adoption du règlement SH 737 autorisant un emprunt de 2 millions de dollars pour la réfection d'aqueduc, d'égout et de voirie."},{title: "Soutien Financier à la Corporation Culturelle", generated_summary: "Autorisation de décaissement pour soutenir la corporation culturelle de Chamounigan."},{title: "Désignation des Membres du Conseil Local du Patrimoine", generated_summary: "Désignation des membres pour le conseil local du patrimoine."},{title: "Subvention pour le Programme Société d'Habitation", generated_summary: "Versement d'une subvention pour le programme Société d'habitation du Québec."},{title: "Subvention à l'Office de Tourisme", generated_summary: "Autorisation d'une subvention à l'Office de Tourisme Foire et Congrès de Chamounigan."},{title: "Représentations pour Divers Événements", generated_summary: "Approbation des représentations pour divers événements."}]
discussion_points3.each do |d|
  conseil3.discussion_points.create!(d)
end

