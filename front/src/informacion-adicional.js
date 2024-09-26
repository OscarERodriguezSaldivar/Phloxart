import React, { useState } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import axios from 'axios';

import logo from './img/logo.png';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function InformacionAdicional() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres] = useState('');
  const [edad, setEdad] = useState('');
  const [foto, setFoto] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [area, setArea] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('apellidoPaterno', apellidoPaterno);
    formData.append('apellidoMaterno', apellidoMaterno);
    formData.append('nombres', nombres);
    formData.append('edad', edad);
    formData.append('foto', foto); // Agregar la imagen al FormData
    formData.append('descripcion', descripcion);
    formData.append('area', area);

    try {
      axios.post("http://localhost:3001/informacion-adicional", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage("Información guardada correctamente");
      navigate("/inicio-sesion"); 
    } catch (error) {
      console.error('Error al enviar la información:', error);
    }
  }

  return (
    
    <div className="text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <img style={{ maxWidth: 150 }} src={logo} alt="logo" />
      <h2 style={{ fontFamily: 'Montserrat, sans-serif' }}>Phloxart</h2>

    <div className="registrationBox">
      <div className="box2">
      <h5>Completa tu información adicional:</h5>
          <form onSubmit={handleSubmit}>

            <div className="text-center" >

              <label>Apellido Paterno:</label>
              <input type="text" className="form-control" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />

            </div>

            <div className="text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <label>Apellido Materno:</label>
              <input type="text" className="form-control" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
            </div>

            <div className="text-center">
              <label>Nombres:</label>
              <input type="text" className="form-control" value={nombres} onChange={(e) => setNombres(e.target.value)} />
            </div>

            <div className="text-center">
              <label>Edad:</label>
              <input type="text" className="form-control" value={edad} onChange={(e) => setEdad(e.target.value)} />
            </div>

            <div className="text-center">
              <label>Foto:</label>
              <input type="file" className="form-control-file" onChange={(e) => setFoto(e.target.files[0])} />
            </div>

            <div className="text-center">
              <label>Descripción:</label>
              <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            <div className="text-center">
              <label>Área:</label>
              <input type="text" className="form-control" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>

            <button type="submit" className="botonGenerico text-white">Guardar</button>

          </form>

      </div>
    </div>


      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}

export default InformacionAdicional;
