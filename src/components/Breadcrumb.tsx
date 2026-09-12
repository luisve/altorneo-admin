import { Link } from 'react-router-dom'


type BreadcrumbProps = {
	seccion: string;
};


export const Breadcrumb = ({ seccion }: BreadcrumbProps) => {
	return (
		<nav aria-label="breadcrumb">
			<ol className="breadcrumb m-2">
				<li className="breadcrumb-item">
					<Link to="/home">Home</Link>
				</li>
				{seccion === "jueces" && <li className="breadcrumb-item active" aria-current="page">Jueces</li>}
				{seccion === "categorias" && <li className="breadcrumb-item active" aria-current="page">Categorías</li>}
				{seccion === "sedes" && <li className="breadcrumb-item active" aria-current="page">Sedes</li>}
				{seccion === "equipos" && <li className="breadcrumb-item active" aria-current="page">Equipos</li>}
				{seccion === "jugadores" && <li className="breadcrumb-item active" aria-current="page">Jugadores</li>}

				{seccion === "torneo alta" && <li className="breadcrumb-item active" aria-current="page">Torneo Alta</li>}
				{seccion === "torneo equipos" && <li className="breadcrumb-item active" aria-current="page">Torneo Equipos</li>}
				{seccion === "torneo fechas" && <li className="breadcrumb-item active" aria-current="page">Torneo Fechas</li>}
				{seccion === "torneo iniciar" && <li className="breadcrumb-item active" aria-current="page">Torneo Iniciar</li>}

				{seccion === "fecha sanciones" && <li className="breadcrumb-item active" aria-current="page">Fecha Sanciones</li>}
				{seccion === "fecha eventos" && <li className="breadcrumb-item active" aria-current="page">Fecha Eventos</li>}
				{seccion === "fecha imprimir" && <li className="breadcrumb-item active" aria-current="page">Fecha Imprimir</li>}
				{seccion === "fecha confirmar" && <li className="breadcrumb-item active" aria-current="page">Fecha Confirmar Datos</li>}
			</ol>
		</nav >
	)
}
