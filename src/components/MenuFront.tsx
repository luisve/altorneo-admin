import { Link } from 'react-router-dom'
import { URLROOT } from '../utils/constants'
//import { urlRoot } from '../utils/constants'


export const MenuFront = () => {


	return (
		<>
			<nav className="navbar navbar-expand-lg sticky-top mainmenu">
				<div className="container">
					<Link className="navbar-brand" to="/home">
						<img src={URLROOT + 'admin/logo512.png'} alt="Logo" width="30" className="d-inline-block align-text-top" />
					</Link>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav">
							<li className="nav-item"><a href="../" className="nav-link">Home</a></li>
							<li className="nav-item"><a href="/site/buscador" className="nav-link">Buscar Campeonato</a></li>
							<li className="nav-item"><a href="/admin" className="nav-link">Soy Organizador</a></li>
							<li className="nav-item"><a href="/site/registro" className="nav-link">Registro</a></li>
							<li className="nav-item"><a href="/site/comoFunciona" className="nav-link">Como Funciona</a></li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}
