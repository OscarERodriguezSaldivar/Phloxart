import React, { useState, useEffect } from "react";
import axios from 'axios';

const Rating = ({ initialValue, userId, postId, onChange }) => {
    const [rating, setRating] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/obtener-promedio-valoracion-publicacion/${postId}`);
                const fetchedRating = response.data.promedio;
                setRating(fetchedRating);
            } catch (error) {
                console.error("Error al obtener la valoración:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRating();
    }, [postId]);

    const handleClick = async (value) => {
        setRating(value);
        if (onChange) {
            onChange(value);
        }
        try {
            const response = await axios.post('http://localhost:3001/guardar-valoracion', { valoracion: value, userId, postId });
            console.log("Valoración enviada:", response.data);
        } catch (error) {
            console.error("Error al enviar la valoración:", error);
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={index}
                        className={ratingValue <= rating ? "star filled" : "star"}
                        onClick={() => handleClick(ratingValue)}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default Rating;
