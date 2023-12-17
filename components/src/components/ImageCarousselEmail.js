import React, { useState, useEffect } from 'react';
import Slider from 'react-slick'; // ou une autre bibliothèque de carrousel

const ImageCarousselEmail = ({ onImageSelect, onImageDrop }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fonction pour charger les images depuis le serveur
        const fetchImages = async () => {
            const response = await fetch('/wp-json/booking67/v1/get-images');
            const imageData = await response.json();
            setImages(imageData);
        };

        fetchImages();
    }, []);

    const settings = {
        // ...les réglages de votre carrousel (react-slick ou autre)
    };

    return (
        <Slider {...settings}>
            {images.map((image) => (
                <div
                    key={image.id}
                    draggable
                    onDragStart={(e) => {
                        // Définissez l'URL de l'image pour le transfert
                        e.dataTransfer.setData('text/plain', image.url);
                        onImageSelect(image);
                    }}
                    onDragEnd={onImageDrop} // Vous pourriez avoir besoin d'ajuster cette partie en fonction de votre logique
                >
                    <img src={image.thumbnail_url} alt={image.alt_text} />
                </div>
            ))}
        </Slider>
    );
};

export default ImageCarousselEmail;
