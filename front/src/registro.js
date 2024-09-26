import React, { useState } from 'react';
import logo from './img/logo.png';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Registro() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [message, setMessage] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false); // Nuevo estado para controlar el registro exitoso

  const sendDatos = () => {
    // Validaciones...

    axios.post("http://localhost:3001/create", {
      user: user,
      email: email,
      pass: pass
    }).then(() => { 
      setMessage("Registrado correctamente"); 
      setRegistroExitoso(true); // Cambiar el estado a true cuando el registro sea exitoso
    });
  }

  // Componente de registro exitoso
  const RegistroExitosoComponent = () => (
    <div className="registroExitoso">
      <h2 style={{ fontFamily: 'Montserrat, sans-serif' }}>¡Registro exitoso!</h2>
      <p style={{ fontFamily: 'Montserrat, sans-serif' }} >Por favor completa la siguiente información adicional:</p>
      <Link to={`/informacion-adicional/${email}`} className="btn btn-primary">Continuar</Link>
    </div>
  );
  
  return (
    <div className="registrationBox">
      <div className="box1">
        <div className='text-center'>
          <img style={{ maxWidth: 150 }} src={logo} alt="Logo"></img>
          <h4 style={{ fontFamily: 'Montserrat, sans-serif' }}>Phloxart</h4>
        </div>

        {registroExitoso ? ( // Mostrar el componente de registro exitoso si el registro es exitoso
          <RegistroExitosoComponent />
        ) : (
          <>
            <input type="text" className="form-control" placeholder="Nombre de usuario"
              onChange={(e) => { setUser(e.target.value) }} 
              style={{ fontFamily: 'Montserrat, sans-serif' }}/>
            <input type="email" className="form-control" placeholder="Correo"
              onChange={(e) => { setEmail(e.target.value) }} 
              style={{ fontFamily: 'Montserrat, sans-serif' }}/>

            <input type="password" className="form-control" placeholder="Contraseña"
              onChange={(e) => { setPass(e.target.value) }} 
              style={{ fontFamily: 'Montserrat, sans-serif' }}/>

            <div className='text-center'>
              <button className="botonGenerico text-white" onClick={sendDatos}
              style={{ fontFamily: 'Montserrat, sans-serif' }}>Registrar</button>
            </div>
            <div className="registroLink" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <p>¿Ya tienes cuenta?</p>
              <Link to="/inicio-sesion" style={{ color: 'brown' }}>Iniciar sesión</Link>
            </div>
            {message && <p style={{ color: 'red' }}>{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default Registro;
