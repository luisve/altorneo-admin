
import { URL_IMAGES } from '../utils/constants';


import { EventoType } from '../types/partido/EventoType';
import { PartidoPrintView } from '../views/partido/PartidoPrintView';


type GrillaProps = {
	listaDatos: EventoType[];
	partido: PartidoPrintView;
	borrarDato: (id: number) => void;
};


export const GrillaEventos = ({ listaDatos, partido, borrarDato }: GrillaProps) => {


	let tiempoActual: number | null = null;


	const datoIco: Record<string, JSX.Element> = {
		"C": <img src={URL_IMAGES + 'svg/pelotaContra.svg'} alt='Gol en contra' className='h-75 mb-1' />,
		"G": <img src={URL_IMAGES + 'svg/pelota.svg'} alt='Gol' className='h-75 mb-1' />,
		"A": <img src={URL_IMAGES + 'svg/tarjetaAmarilla.svg'} alt='Gol' className='h-75 mb-1' />,
		"R": <img src={URL_IMAGES + 'svg/tarjetaRoja.svg'} alt='Gol' className='h-75 mb-1' />,
	};


	const listaDatosOrdenada = listaDatos.sort((a, b) => {
		if (a.Tiempo !== b.Tiempo) {
			return a.Tiempo - b.Tiempo;
		}
		return a.Minuto - b.Minuto;
	});


	return (
		<>
			<div className="row mb-1 border-bottom" style={{ height: '20px' }}>
				<div className='col-5 fw-bold'>Jugador</div>
				<div className='col-2 text-center fw-bold'>Dato Min Dato</div>
				<div className='col-5 text-end fw-bold'>Jugador</div>
			</div>
			<div className='datos-body'>
				{
					listaDatosOrdenada.map((dato, index) => {
						const mostrarTitulo = dato.Tiempo !== tiempoActual;
						tiempoActual = dato.Tiempo;
						return (
							<div className="row mb-1 border-bottom" key={index}>
								{
									mostrarTitulo && <div className='col-12 text-center fw-bold h4'>{dato.Tiempo}</div>
								}
								<div className='col-5 text-end p-0'>
									{
										dato.IdEquipo === partido.IdLocal &&
										dato.NombreJugador + (dato.Evento === "X" ? " <=> " + dato.NombreJugadorIngreso : "")
									}
								</div>
								<div className="col-2">
									<div className="row" style={{ height: '20px' }}>
										<div className='p-0 col-4 text-end h-100'>{dato.IdEquipo === partido.IdLocal ? datoIco[dato.Evento] : ""}</div>
										<div className='p-0 col-4 text-center'>{dato.Minuto}</div>
										<div className='p-0 col-4 text-start h-100'>{dato.IdEquipo === partido.IdVisitante ? datoIco[dato.Evento] : ""}</div>
									</div>
								</div>
								<div className='col-5 p-0'>
									{
										dato.IdEquipo === partido.IdVisitante &&
										dato.NombreJugador + (dato.Evento === "X" ? " <=> " + dato.NombreJugadorIngreso : "")
									}
									{
									/*
									<span
										role="button"
										className="material-icons-outlined link-delete"
										onClick={(e) => borrarDato(Number(e.currentTarget.dataset.id))}
										data-id={index}>
										delete
									</span>
									*/
									}
									<span
										role="button"
										onClick={(e) => borrarDato(Number(e.currentTarget.dataset.id))}
										data-id={index}
										className="far fa-trash-alt float-end">
									</span>
								</div>
							</div>
						)
					})
				}
			</div>
		</>
	)
}

