import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import Posts from './posts';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import SinglePost from './singlepost'; // Importa el componente SinglePost

function Perfil() {
    const [user, setUser] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null); // Nuevo estado para almacenar el post seleccionado
    const navigate = useNavigate();

    useEffect(() => {
        const userLoggedIn = localStorage.getItem('sesion'); // Supongamos que 'sesion' es la clave donde se almacena la información de inicio de sesión
        if (!userLoggedIn) {
            console.log("NO TIENES SESION");
            navigate('/inicio-sesion'); // Redirigir al usuario a la página de inicio de sesión
        }
        const fetchUserData = async () => {
            try {
                const sesionUsuario = localStorage.getItem('sesion');
                const nombreUsuario = sesionUsuario ? JSON.parse(sesionUsuario) : null;
                const response = await axios.get(`http://localhost:3001/obtener-informacion-usuario/${nombreUsuario.usuario}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        };

        fetchUserData();
    }, []);

    const getImagePath = (imageUrl) => {
        if (imageUrl && imageUrl.startsWith('http://localhost:3001/img/')) {
            return imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        }

        return imageUrl;
    };

    const handlePostClick = (post) => {
        setSelectedPost(post); // Cuando se hace clic en un post, establece el post seleccionado
    };

    const handleCloseSinglePost = () => {
        setSelectedPost(null); // Cuando se cierra el post único, establece el post seleccionado como null
    };

    return (
        <div className='imgFondo' style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Header />
            <div className=" container-fluid">
                <div className='px-5'>
                    <div className="row px-4 justify-content-center">
                            {user && (
                                <div className='col-9 py-2 fondoDetrasCard' >
                                    <div className='row'>
                                        <div className="col-lg-6 col-md-4 col-sm-12  py-3">
                                        <h4 className='negrita px-5'>Mi perfil</h4>
                                                <div className="form-group text-center">
                                                    <div className="img-container">
                                                        <img src={`/img/${getImagePath(user.foto_Users)}`} alt="Foto de perfil" 
                                                        style={{ width: '60%', height: '300px', objectFit: 'cover', borderRadius:'10px'}}/>
                                                    </div>
                                                </div>
                                        </div>

                                        <div className='col-lg-6 col-md-8 col-sm-12 py-5'>
                                            <div className="form-group">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"> <label className="col-form-label negrita tamLetra">Nombre:</label> </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control bg-transparent border-0 tamLetra" value={user.nombres_Users} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"> <label className="col-form-label negrita tamLetra">Correo:</label> </div>
                                                    <div className="col">
                                                        <input type="email" className="form-control bg-transparent border-0 tamLetra" value={user.correoUser} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"> <label className="col-form-label negrita tamLetra">Edad:</label> </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control bg-transparent border-0 tamLetra" value={user.edad_Users} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"> <label className="col-form-label negrita tamLetra">Descripción:</label> </div>
                                                        <div className="col">
                                                            <textarea className="form-control bg-transparent border-0 tamLetra" value={user.descripcion_Users} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                               <div className="form-group">
                                                <div className="row align-items-center">
                                                    <div className="col-auto"> <label className="col-form-label negrita tamLetra">Área:</label> </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control bg-transparent border-0 tamLetra" value={user.area_Users} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}

                    </div>
                </div>
                <div className='row'>
                    <div className="col-12">
                            <Posts onPostClick={handlePostClick} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil;
