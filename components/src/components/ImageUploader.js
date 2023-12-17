// ImageUploader.js
import React, { useState, useEffect } from 'react';

const ImageUploader = ({ onImageSelect }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Chargez la liste des images déjà présentes sur le serveur
        fetchImages();
    }, []);

    const fetchImages = async () => {
        // Remplacez '/api/images' par l'endpoint de votre serveur
        const response = await fetch('/wp-json/booking67/v1/get-images');
        const imageData = await response.json();
        setImages(imageData);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            // Remplacez '/api/upload' par l'endpoint d'upload de votre serveur
            const response = await fetch('/wp-json/booking67/v1/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const uploadedImage = await response.json();
                setImages([...images, uploadedImage]);
                onImageSelect(uploadedImage);
            } else {
                // Gérez les erreurs d'upload ici
            }
            setUploading(false);
        }
    };

    return (
        <div>
            {uploading ? <p>Chargement...</p> : null}
            <input type="file" onChange={handleFileUpload} />
            <div>
                {images.map((image) => (
                    <img
                        key={image.filename}
                        src={image.url}
                        alt={image.alt}
                        onClick={() => onImageSelect(image)}
                        style={{ cursor: 'pointer', maxWidth: '100px', margin: '5px' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
