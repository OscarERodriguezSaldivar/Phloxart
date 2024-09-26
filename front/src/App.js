// App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registro from './registro';
import InicioSesion from './inicio-sesion';
import Homepage from './Homepage';
import InformacionAdicional from './informacion-adicional';
import Perfil from './perfil';


function App() {
  return (
    <BrowserRouter>
      <div className="imgFondoGeneral">
        <Routes>
          <Route path="/" element={<Navigate to="/inicio-sesion" />} /> {/* Redirige a /inicio-sesion por defecto */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/inicio-sesion" element={<InicioSesion />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/informacion-adicional/:email" element={<InformacionAdicional/>}/>
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
