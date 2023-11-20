export const booking67_sendMail_confirmation = (to, subject, htmlContent, plainTextContent) => {
    const apiUrl = '/wp-json/booking67/v1/send-mail';

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': wpApiSettings.nonce
        },
        body: JSON.stringify({ to, subject, html: htmlContent, text: plainTextContent })
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.code && data.code === 'email_send_error') {
                console.error('Erreur lors de l’envoi de l’email:', data.message);
            } else {
                console.log('Email envoyé avec succès:', data);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
};