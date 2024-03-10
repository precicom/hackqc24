class Theme < ApplicationRecord
    enum :category, { 
        territoire: 0,
        soumissions: 1,
        affaires_juridiques: 2,
        direction_generale: 3,
        ressources_financiere: 4,
        greffe: 5,
        service_police: 6,
        securite_incendie: 7,
        travaux_public: 8,
        environnement: 9,
        urbanisme: 10,
        developpement_economique: 11,
        loisirs_et_culture: 12,
        legislation: 13,
    }

    
end
