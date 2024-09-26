// InicioSesion.js
import logo from './img/logo.png';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BrowserRouter, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function InicioSesion() {
    const [usuario, setUsuario] = useState('');
    const [pass, setPass] = useState('');
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        localStorage.removeItem('sesion');
    }, []);

    const handleLogin = () => {
        if (!usuario || !pass) {
            setMessage("Por favor completa todos los campos");
            return;
        } else {
            axios.post("http://localhost:3001/login", { usuario: usuario, pass: pass })
            .then((data) => {
                setMessage(data.data.message);
                if (data.data.success) {
                    localStorage.setItem('sesion', JSON.stringify(data.data.usuario));
                    console.log(data.data);
                    setLoggedIn(true);
                }
            })
            .catch((error) => {
                setMessage("Error al iniciar sesión");
            });
        }
    };

    if (loggedIn) {
        return <Navigate to="/Homepage" />;
    }

    return (
        <div className="registrationBox">
            <div className="box1">
                <div className='text-center'>
                    <img style={{ maxWidth: 150 }} src={logo} alt="logo" />
                    <h4 style={{ fontFamily: 'Montserrat, sans-serif' }}>Phloxart</h4>
                </div>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                />

                <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                />
                <div className='text-center'>
                    <button style={{ fontFamily: 'Montserrat, sans-serif' }} className="botonGenerico text-white" onClick={handleLogin}>Iniciar sesión</button>
                </div>
                <div className="registroLink">
                    <p style={{ fontFamily: 'Montserrat, sans-serif' }}>Aun no tienes cuenta?</p>
                    <Link to="/registro" className="btn-outline-info" style={{ color: 'brown' , fontFamily: 'Montserrat, sans-serif' }}>Registrate aqui</Link>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default InicioSesion;
