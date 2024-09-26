import React, { useState, useEffect } from "react";
import axios from "axios";
import borrar from"./img/basuraIcon.png";

function Posts({ onPostClick }) { 
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem('sesion');
        const nombreUsuario = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
        if (nombreUsuario) {
            setCurrentUser(nombreUsuario);
        }

        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:3001/publicaciones");
                setPosts(response.data);
            } catch (error) {
                console.error("Error al obtener las publicaciones:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:3001/categorias");
                setCategories(response.data);
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        };

        fetchPosts();
        fetchCategories();
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            // Realiza la solicitud DELETE al servidor para eliminar la publicación
            await axios.delete(`http://localhost:3001/borrar-publicacion/${postId}`);
            // Actualiza la lista de publicaciones después de eliminar la publicación
            setPosts(posts.filter(post => post.post_id !== postId));
        } catch (error) {
            console.error("Error al eliminar la publicación:", error);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryName = e.target.value;
        setSelectedCategory(selectedCategoryName);
    };

    return (
        <div className="container-fluid imgFondo px-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <div className="px-5">
                    <div className="row p-2" >
                        <div className="col-4">
                            {window.location.pathname !== "/perfil" && (
                                // Selector de categorías
                                <select className="btn text-light" style={{ backgroundColor: '#735182' }} onChange={handleCategoryChange}>
                                    <option value={null}>Todas las categorías</option>
                                    {categories.map(category => (
                                        <option key={category.categoria_id} value={category.categoria_nombre}>{category.categoria_nombre}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>
         <div className="px-5">
            <div className="row  px-5 justify-content-center">
                <div className="col-lg-10 ">
                    <div className="row fondoDetrasCard px-4">
                    {posts.map(post => {
                                    // Verificar si estamos en la página de Perfil y el nombre de usuario de la publicación coincide con el usuario actual
                                    if ((window.location.pathname === "/perfil" && post.nombre_usuario === currentUser.usuario) ||
                                        (!selectedCategory || post.nombre_categoria === selectedCategory)) {
                                        // Si estamos en la página de Perfil y el post no pertenece al usuario actual, no lo mostramos
                                        if (window.location.pathname === "/perfil" && post.nombre_usuario !== currentUser.usuario) {
                                            return null;
                                        }
                    
                                        return (
                                            <div className="col-lg-4 col-md-6 mb-4">
                                                <div className="cardPost card" key={post.post_id} onClick={() => onPostClick(post)}> {/* Agrega el manejador de clic en la publicación */}
                                                    {/* Detalles del Post */}
                                                    <div className="text-center">
                                                            <img
                                                                src={`/img/${post.post_foto}`}
                                                                alt="Imagen del Post"
                                                                //style={{ width: '400vh', height: '200vh' }} // Establece el tamaño de la imagen
                                                                style={{ width: '100vh', height: '40vh', objectFit: 'cover' }}
                                                                className="card-img-top img-fluid"
                                                            />
                                                        </div>
                                                    <div className="card-body">
                                                        <h2>{post.post_titulo}</h2>
                                                        
                                                        {/* 
                                                        <p>{post.post_descripcion}</p>
                                                        <p>Categoría: {post.nombre_categoria}</p>*/}
                                                        <p>Publicado por: {post.nombre_usuario}</p> {/* Aquí se muestra el nombre del usuario que hizo la publicación */}
                                                        
                                                        {window.location.pathname === "/perfil" && (
                                                            <button onClick={() => handleDeletePost(post.post_id)} className="btn"><img src={borrar} alt="Borrar" style={{width:'5vh', height: '5vh'}}/></button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                    </div>
                </div>

            </div>
            </div>
        </div>
    );
    
}

export default Posts;
