// URL de base pour les requêtes API
const BASE_URL = '/wp-json/booker67/v1';

/**
 * Vérifie si une nouvelle option peut être insérée en fonction de maxAllowed.
 *
 * @param {string} genericType - Le type générique à vérifier.
 * @param {number} maxAllowed - Le nombre maximum d'options de ce type autorisé.
 * @return {Promise<boolean>} - Résolu avec true si une nouvelle option peut être insérée, false sinon.
 */
export function canInsertNewOption(genericType, maxAllowed) {
    const apiUrl = `${BASE_URL}/options/generic_type_count/${genericType}`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors de la tentative de récupération des données.');
            }
            return response.json();
        })
        .then(data => {
            if (data.count < maxAllowed) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error('Il y a eu un problème avec l\'opération fetch:', error.message);
            return false;
        });
}
