import React, { useState,useCallback } from 'react';
import './css/EmailComposer.css'
import ImageUploader from './ImageUploader';
import ImageCarousselEmail from './ImageCarousselEmail';
// Composant pour la prévisualisation de l'e-mail
const EmailPreview = ({ subject, body }) => {
    // Convertit le corps du texte en HTML en toute sécurité
    const createMarkup = htmlString => ({ __html: htmlString });

    return (
        <div className="email-preview">
            <h2>Prévisualisation de l'Email</h2>
            <h3>Objet: {subject}</h3>
            <div dangerouslySetInnerHTML={createMarkup(body)} />
        </div>
    );
};

// Composant principal pour la rédaction de l'e-mail
// EmailComposer.js



const EmailComposer = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [images, setImages] = useState([]);

    // Cette fonction sera appelée après un upload réussi
    const handleNewImage = (newImage) => {
        setImages([...images, newImage]);
    };
    const handleImageSelect = (image) => {
        const imageHtml = `<img src="${image.url}" alt="${image.alt}" />`;
        setBody(body + imageHtml);
    };
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const imageUrl = e.dataTransfer.getData('text/plain');
        setBody(body + `<img src="${imageUrl}" alt="Image" />`);
    }, [body]);
    return (
        <div className="email-composer" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div className="email-form">
                <input
                    type="text"
                    placeholder="Objet du mail"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />

                    {/* ...autres champs de saisie... */}


                <textarea
                    placeholder="Corps du mail"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>
            <ImageUploader onImageSelect={handleImageSelect} />

            <EmailPreview subject={subject} body={body} />
        </div>
    );
};

export default EmailComposer;
