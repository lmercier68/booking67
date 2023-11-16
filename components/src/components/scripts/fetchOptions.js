async function fetchOptions(types) {

    try {
        let url = new URL('https://wordpress-react-test.local/wp-json/booker67/v1/options/filter');
        types.forEach(type => url.searchParams.append('types[]', type));
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Erreur réseau ou serveur');
        }

        const data = await response.json();
        console.log('Options récupérées:', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des options:', error);
    }
}

// Exposez la fonction pour qu'elle soit utilisable à l'extérieur du fichier
export default fetchOptions;
