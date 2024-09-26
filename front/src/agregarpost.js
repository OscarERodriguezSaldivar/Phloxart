import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import './App.css';

function Agregarpost() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        photo: null
    });
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null); // Estado para almacenar la información del usuario
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChangexd = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setFormData({
        ...formData,
        photo: e.target.files[0]
    });
    }
    useEffect(() => {
        // Obtener información del usuario desde localStorage
        const sesionUsuario = localStorage.getItem('sesion');
        const nombreUsuario = sesionUsuario ? JSON.parse(sesionUsuario) : null;
        console.log("Nombre de usuario:", nombreUsuario);
        if (nombreUsuario) {
            // Si hay un usuario en sesión, obtener su información
            console.log("ya estoy cargando el nombre del usuario");
            fetchUserData(nombreUsuario.usuario);
        } else {
            console.error('Usuario no encontrado en el localStorage');
        }

        // Obtener categorías
        axios.get('http://localhost:3001/categorias')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las categorías:', error);
            });
    }, []);

    const fetchUserData = async (nombreUsuario) => {
        try {
            const response = await axios.get(`http://localhost:3001/obtener-informacion-usuario/${nombreUsuario}`);
            console.log("Datos del usuario:", response.data);
            setUser(response.data); // Asigna todo el objeto de datos de usuario
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    };
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('post_titulo', formData.title);
            formDataToSend.append('post_descripcion', formData.description);
            formDataToSend.append('post_categoriaid', formData.category);
            formDataToSend.append('post_foto', formData.photo); // Cambiar el nombre del campo a 'post_foto'
    
            console.log('ID del usuario:', user.ID_User);
            formDataToSend.append('post_usuarioid', user.ID_User);
            
    
            // Imprime los datos antes de enviarlos al backend
            for (const [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }
    
            // Envía los datos al backend
            await axios.post('http://localhost:3001/crear-publicacion', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Limpia el formulario después de enviar los datos
            setFormData({
                title: '',
                description: '',
                category: '',
                photo: null
            });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            // Puedes mostrar un mensaje de error al usuario
            alert('Error al agregar la publicación. Por favor, inténtalo de nuevo.');
        }
    };
    
    
    return (
        <div className="container">
    <div className="row justify-content-center text-center py-5">
        <div className="col-lg-8 col-md-10 mb-4 cardPub card p-4">
            <h2>Agregar Publicación</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6 col-md-4 col-sm-12">
                        <div className="form-group py-3">
                            <input type="text" className="form-control" placeholder="Título" name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="form-group py-3">
                            <textarea className="form-control" placeholder="Descripción" name="description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="form-group py-3">
                            <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Seleccione una categoría</option>
                                {categories.map(category => (
                                    <option key={category.categoria_id} value={category.categoria_id}>{category.categoria_nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-sm-12 fondoDetrasCard "style={{ width: '400px', height: '350px'}}>   
                        <div className="form-group">
                            <label>Foto</label>
                            <input type="file" className="form-control-file" name="photo" onChange={handleFileChangexd} required />
                               {imagePreview && (
                                <img src={imagePreview} alt="Previsualización" style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius:'10px' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn botonGenerico">Agregar Publicación</button>
            </form>
        </div>
    </div>
</div>

    );
}

export default Agregarpost;
