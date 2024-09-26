// En el componente HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './header';
import Agregarpost from './agregarpost';
import Posts from './posts';
import SinglePost from './singlepost';
import './App.css';

function HomePage() {
    const [showPosts, setShowPosts] = useState(true);
    const [showAgregarpost, setShowAgregarpost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay información en localStorage para determinar si el usuario está logueado
        const userLoggedIn = localStorage.getItem('sesion'); // Supongamos que 'sesion' es la clave donde se almacena la información de inicio de sesión
        if (!userLoggedIn) {
            console.log("NO TIENES SESION");
            navigate('/inicio-sesion'); // Redirigir al usuario a la página de inicio de sesión
        }
    }, [navigate]);

    const togglePostsVisibility = () => {
        setShowPosts(!showPosts);
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setShowPosts(false);
    };

    const handleCloseSinglePost = () => {
        setSelectedPost(null);
        setShowPosts(true);
    };

    


    return (
        <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Header />
            {showPosts && (
                <div className="posts-fullscreen">
                    <Posts onPostClick={handlePostClick} />
                </div>
            )}
            {selectedPost && (
                <SinglePost post={selectedPost} onClose={handleCloseSinglePost} />
            )}

            <div>
                {showAgregarpost && <Agregarpost />}
                <button className="circle-btn" onClick={() => {
                    togglePostsVisibility();
                    setShowAgregarpost(!showAgregarpost);
                }}>+</button>
            </div>
        </div>
    );
}

export default HomePage;