import React, { useState, useEffect } from "react";
import axios from "axios";
import Rating from "./Rating";
import './App.css';
import borrar from"./img/basuraIcon.png";
import editar from"./img/Editar.png"


function SinglePost({ post, onClose }) {
    const { post_id, post_titulo, post_descripcion, post_foto, nombre_categoria, nombre_usuario } = post;
    const [user, setUser] = useState(null); // Estado para almacenar la información del usuario
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]); // Estado para almacenar los comentarios
    const [averageRating, setAverageRating] = useState(null); // Estado para almacenar el promedio de la valoración

    useEffect(() => {
        const sesionUsuario = localStorage.getItem('sesion');
        const nombreUsuario = sesionUsuario ? JSON.parse(sesionUsuario) : null;
        console.log("Nombre de usuario:", nombreUsuario);
        if (nombreUsuario) {
            console.log("ya estoy cargando el nombre del usuario");
            fetchUserData(nombreUsuario.usuario);
        } else {
            console.error('Usuario no encontrado en el localStorage');
        }

        fetchComments();
        obtenerPromedioValoracion();
    }, [post_id]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const fetchUserData = async (nombreUsuario) => {
        try {
            const response = await axios.get(`http://localhost:3001/obtener-informacion-usuario/${nombreUsuario}`);
            console.log("Datos del usuario:", response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/obtener-comentarios-publicacion/${post_id}`);
            console.log("Comentarios obtenidos:", response.data);
            setComments(response.data);
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
        }
    };

    const obtenerPromedioValoracion = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/obtener-promedio-valoracion-publicacion/${post_id}`);
            console.log("Promedio de valoración obtenido:", response.data);
            setAverageRating(response.data.promedio);
        } catch (error) {
            console.error('Error al obtener el promedio de la valoración:', error);
            setAverageRating(null);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            const userId = user.ID_User;
            console.log(userId);
            const response = await axios.post(`http://localhost:3001/comentar-publicacion/${post_id}`, { comment, userId });
            console.log("Comentario enviado:", response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error al enviar el comentario:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:3001/borrar-comentario/${commentId}`);
            console.log("Comentario eliminado correctamente");
            // Actualizar la lista de comentarios después de eliminar el comentario
            fetchComments();
        } catch (error) {
            console.error("Error al eliminar el comentario:", error);
        }
    };


    // Agrega nuevos estados
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    // Función para manejar cambios en el comentario en edición
    const handleEditingCommentChange = (e) => {
        setEditingCommentText(e.target.value);
    };

    // Función para iniciar la edición de un comentario
    const handleEditComment = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setEditingCommentText(commentText);
    };

    // Función para enviar la solicitud de edición al servidor
    const handleUpdateComment = async (e, commentId) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/editar-comentario/${commentId}`, { text: editingCommentText });
            console.log("Comentario actualizado correctamente");
            // Limpiar el estado de edición
            setEditingCommentId(null);
            setEditingCommentText('');
            // Actualizar la lista de comentarios después de editar el comentario
            fetchComments();
        } catch (error) {
            console.error("Error al editar el comentario:", error);
        }
    };


    return (
        <div className='imgFondo'>
        <div className="container ">
            <div className="row justify-content-center ">
                <div className=" col-lg-8 col-md-10 mb-4 fondoDetrasCard px-5">
                    <button onClick={onClose} className="btn botonGenerico">X</button>

                    <div className="row cardVerPub p-4">
                        <div className="col-lg-8 col-md-8 col-sm-12 text-center">
                            <img
                                src={`/img/${post_foto}`}
                                alt="Imagen del Post"
                                style={{ width: '60vh', height: '60vh', objectFit: 'cover', borderRadius:'10px' }}
                            />

                        </div>
                        <div className="col-lg-4 col-md-8 col-sm-12">
                        <h2 >{post_titulo}</h2>
                            <p >{post_descripcion}</p>
                            <p >Categoría: {nombre_categoria}</p>
                            <p >Publicado por: {nombre_usuario}</p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="">
                                <h5 className="textPurple">Rating</h5>
                                <div className="card bg-transparent border-0">
                                    <div className="card-body">
                                        <Rating initialValue={averageRating} userId={user ? user.ID_User : null} postId={post_id} />
                                    </div>
                                </div>
                            </div>

                            
                                <form onSubmit={handleSubmitComment}>
                                    <div className="form-group py-3 ">
                                        <textarea className="form-control" value={comment} onChange={handleCommentChange} placeholder="Escribe tu comentario..." required />
                                        <button type="submit" className="btn botonGenerico "style={{ flex: '0 0 auto', width: '170px', height:'50px' }}>Publicar </button>
                                    </div>
                                </form>

                        <h5>Comentarios</h5>
                        
                            <ul className="comentarioFondo" style={{ borderRadius: '10px' }}>
                                {comments.map((commentItem, index) => (
                                    <li key={index} className="">
                                        {editingCommentId === commentItem.comentario_id ? (
                                            <form onSubmit={(e) => handleUpdateComment(e, commentItem.comentario_id)}>
                                                <textarea
                                                    className="form-control"
                                                    value={editingCommentText}
                                                    onChange={handleEditingCommentChange}
                                                    required
                                                />
                                                <button type="submit" className="btn botonGenerico" style={{ flex: '0 0 auto', width: '50px', height: '40px' }}>OK</button>
                                            </form>
                                        ) : (
                                            <>
                                                {commentItem.coment_texto}
                                                {user && commentItem.coment_usuario === user.ID_User && (
                                                    <>
                                                        <button onClick={() => handleEditComment(commentItem.comentario_id, commentItem.coment_texto)} className="btn ml-2"><img src={editar} alt="Editar" style={{ width: '4vh', height: '4vh' }} /></button>
                                                        <button onClick={() => handleDeleteComment(commentItem.comentario_id)} className="btn ml-2"><img src={borrar} alt="Borrar" style={{ width: '4vh', height: '4vh' }} /></button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default SinglePost;
