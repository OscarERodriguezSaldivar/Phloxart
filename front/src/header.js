import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import './App.css';
import logo from './img/logo.png';

function Header() {

    const sesionString = localStorage.getItem('sesion');
    const sesion = sesionString ? JSON.parse(sesionString) : null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbarFondo">

            <a className="navbar-brand px-4" href="Homepage" style={{ display: 'flex', alignItems: 'center' }}>
                <img  src={logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }} />
                <span >Phloxart</span>
            </a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto align-items-center">
                    {sesion ? (
                        <>
                            <li className="nav-item">
                            <span className="navbar-text"></span>
                            </li>
                            <li className="nav-item" style={{marginRight:'50px'}}>
                                <Link to='/perfil' className="nav-link">{sesion.usuario}</Link>
                                
                            </li>

                            <li className="nav-item">
                                <Link to='/inicio-sesion' className="nav-link">Salir</Link>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link to='/inicio-sesion' className="nav-link">Inicio Sesion</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}
export default Header;
