import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBootstrapModal } from '../hooks/useBootstrapModal'


import { Loading } from './Loading';


import { DatosModal } from '../pages/perfil/DatosModal';
import { CambioPasswordModal } from '../pages/perfil/CambioPasswordModal';


import { LogoutService } from '../services/LoginService';
import { URLROOT } from '../utils/constants';


export const Menu = () => {


	const [contadorLoading, setContadorLoading] = useState(0)
	const modalDatos = useBootstrapModal();
	const modalPassword = useBootstrapModal();


	const logout = async () => {
		setContadorLoading(1);
		const resp = await LogoutService();
		if (resp.msg === "ok") {
			window.location.href = '/';
		}
		setContadorLoading(-1);
	};


	return (
		<>
			<nav className="navbar navbar-expand-lg sticky-top mainmenu">
				<div className="container">
					<Link className="navbar-brand" to="/home">
						<img src={URLROOT + 'admin/logo512.png'} alt="AlTorneo" title='AlTorneo' width="30" className="d-inline-block align-text-top" />
					</Link>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav">
							<li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
							<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" role="button" data-bs-display="static" aria-expanded="false" to="/fechaConfirmar">Fecha</Link>
								<ul className="dropdown-menu">
									<li><Link to="/fechaSanciones" className="menu-link" >Sanciones</Link></li>
									<li><Link to="/fechaEventos" className="menu-link" >Eventos</Link></li>
									<li><Link to="/fechaImprimir" className="menu-link" >Imprimir</Link></li>
									<li><Link to="/fechaConfirmar" className="menu-link" >Confirmar</Link></li>
								</ul>
							</li>
							<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" role="button" data-bs-display="static" aria-expanded="false" to="/torneoIniciar">Torneo</Link>
								<ul className="dropdown-menu">
									<li><Link to="/torneoAlta" className="menu-link">Alta</Link></li>
									<li><Link to="/torneoEquipos" className="menu-link">Equipos</Link></li>
									<li><Link to="/torneoFechas" className="menu-link">Fechas</Link></li>
									<li><Link to="/torneoPagos" className="menu-link">Pagos</Link></li>
									<li><Link to="/torneoIniciar" className="menu-link">Iniciar</Link></li>
								</ul>
							</li>
							<li className="nav-item dropdown">
								<Link className="nav-link dropdown-toggle" role="button" data-bs-display="static" aria-expanded="false" to="/jugadores">Config</Link>
								<ul className="dropdown-menu">
									<li><Link to="/jugadores" className="menu-link" >Jugadores</Link></li>
									<li><Link to="/equipos" className="menu-link" >Equipos</Link></li>
									<li><Link to="/jueces" className="menu-link" >Jueces</Link></li>
									<li><Link to="/categorias" className="menu-link" >Categorias</Link></li>
									<li><Link to="/sedes" className="menu-link" >Sedes</Link></li>
								</ul>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto">
							<li className="nav-item dropdown">
								<Link className="link-profile nav-link dropdown-toggle " role="button" to="" data-bs-display="static" aria-expanded="false">
									<i className="fa-solid fa-user"></i>
								</Link>
								<ul className="dropdown-menu dropdown-menu-end">
									<li><Link className="menu-link" onClick={modalDatos.open} to="">Datos</Link></li>
									<li><Link className="menu-link" onClick={modalPassword.open} to="" >Cambiar Contraseña</Link></li>
									<li><Link className="menu-link" onClick={logout} to="">Salir</Link></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<DatosModal modalRef={modalDatos.ref} />
			<CambioPasswordModal modalRef={modalPassword.ref} />
			<Loading contador={contadorLoading} />
		</>
	)
}