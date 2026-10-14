import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { URLROOT } from '../utils/constants';
import { LogoutService } from '../services/LoginService';
import { useBootstrapModal } from '../hooks/useBootstrapModal';
import { Loading } from './Loading';
import { DatosModal } from '../pages/perfil/DatosModal';
import { CambioPasswordModal } from '../pages/perfil/CambioPasswordModal';

type Item = { label: string; to?: string; onClick?: () => void };

type DropdownItem = {
	icon?: string;
	label: string;
	to: string;
	items: Item[];
};

const dropdownsFecha: DropdownItem[] = [
	{
		label: 'Fecha',
		to: '/fechaSanciones',
		items: [
			{ label: 'Sanciones', to: '/fechaSanciones' },
			{ label: 'Eventos', to: '/fechaEventos' },
			{ label: 'Lista Buena Fe', to: '/fechaListaBuenaFe' },
			{ label: 'Listado', to: '/fechaListado' },
			{ label: 'Confirmar', to: '/fechaConfirmar' },
		],
	},
];
const dropdownsTorneo: DropdownItem[] = [
	{
		label: 'Torneo',
		to: '/torneoIniciar',
		items: [
			{ label: 'Alta', to: '/torneoAlta' },
			{ label: 'Equipos', to: '/torneoEquipos' },
			{ label: 'Fechas', to: '/torneoFechas' },
			{ label: 'Pagos', to: '/torneoPagos' },
			{ label: 'Iniciar', to: '/torneoIniciar' },
		],
	},
];
const dropdownsConfig: DropdownItem[] = [
	{
		label: 'Config',
		to: '/jugadores',
		items: [
			{ label: 'Jugadores', to: '/jugadores' },
			{ label: 'Equipos', to: '/equipos' },
			{ label: 'Jueces', to: '/jueces' },
			{ label: 'Categorias', to: '/categorias' },
			{ label: 'Sedes', to: '/sedes' },
		],
	},
];

// ---------- Dropdown individual ----------
function NavDropdown({ data }: { data: DropdownItem }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLLIElement>(null);
	const location = useLocation();

	// Cerrar al cambiar de ruta
	useEffect(() => {
		setOpen(false);
	}, [location.pathname]);

	// Cerrar al click afuera
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	// Cerrar con Escape
	useEffect(() => {
		function handleEsc(e: KeyboardEvent) {
			if (e.key === 'Escape') setOpen(false);
		}
		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, []);

	const handleToggleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Si el dispositivo tiene hover real (mouse), dejamos que el CSS maneje
		// el hover y permitimos navegar con click.
		const hasHover = window.matchMedia('(hover: hover)').matches;
		if (hasHover) {
			setOpen(false);
			return; // navegación normal del <Link>
		}

		// Touch: primer tap abre, segundo tap navega
		if (!open) {
			e.preventDefault();
			setOpen(true);
		} else {
			setOpen(false); // deja navegar al href del Link
		}
	};

	return (
		<li
			ref={ref}
			className={`nav-item dropdown ${open ? 'show' : ''}`}		>
			<Link
				className="nav-link dropdown-toggle"
				to={data.to}
				role="button"
				aria-expanded={open}
				onClick={handleToggleClick}>
				{data.icon && <i className={`${data.icon} me-2`}></i>}
				{data.label}
			</Link>
			<ul className={`dropdown-menu ${open ? 'show' : ''}`}>
				{data.items.map((item) => (
					!item.onClick ?
						<li key={item.to}>
							<Link
								className="dropdown-item menu-link"
								to={item.to ?? ''}
								onClick={() => setOpen(false)}>
								{item.label}
							</Link>
						</li>
						:
						<li key={item.to}>
							<button
								type="button"
								className="dropdown-item menu-link"
								onClick={() => { item.onClick?.(); setOpen(false); }}>
								{item.label}
							</button>
						</li>
				))}
			</ul>
		</li>
	);
}

// ---------- Menú principal ----------
export const Menu = () => {


	const [collapsed, setCollapsed] = useState(true);


	const [contadorLoading, setContadorLoading] = useState(0)
	const modalDatos = useBootstrapModal();
	const modalPassword = useBootstrapModal();

	const dropdownPerfil: DropdownItem[] = [
		{
			icon: 'fa-solid fa-user',
			label: '',
			to: '',
			items: [
				{ label: 'Datos', to: '1', onClick: () => modalDatos.open() },
				{ label: 'Cambiar Contraseña', to: '2', onClick: () => modalPassword.open() },
				{ label: 'Logout', to: '3', onClick: () => logout() },
			],
		},
	]


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
						<img
							src={URLROOT + 'admin/logo512.png'}
							width="30"
							className="d-inline-block align-text-top"
							alt="logo"
						/>
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						aria-controls="navbarSupportedContent"
						aria-expanded={!collapsed}
						aria-label="Toggle navigation"
						onClick={() => setCollapsed((c) => !c)}				>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`}
						id="navbarSupportedContent"				>
						<ul className="navbar-nav">
							<li className="nav-item">
								<Link className="nav-link" to="/home">Home</Link>
							</li>
							{
								dropdownsFecha.map((d) => (
									<NavDropdown key={d.label} data={d} />
								))
							}
							{
								dropdownsTorneo.map((d) => (
									<NavDropdown key={d.label} data={d} />
								))
							}
							{
								dropdownsConfig.map((d) => (
									<NavDropdown key={d.label} data={d} />
								))
							}
						</ul>
						<ul className="navbar-nav ms-auto">
							{
								dropdownPerfil.map((d) => (
									<NavDropdown key={d.label} data={d} />
								))
							}
						</ul>
					</div>
				</div>
			</nav>
			<DatosModal modalRef={modalDatos.ref} />
			<CambioPasswordModal modalRef={modalPassword.ref} />
			<Loading contador={contadorLoading} />
		</>
	);
}