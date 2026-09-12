import { useState, useEffect, ChangeEvent } from 'react'


import { Tabla } from '../../../components/Tabla';
import { TorneoEquipoJugadorType } from '../../../types/torneo/TorneoEquipoJugadoresType';
import { getJugadoresXTorneoEquipoService, postTorneoEquipoJugadorCheckService } from '../../../services/torneo/TorneoJugadorService';
import { Loading } from '../../../components/Loading';
import { EquipoView } from '../../../views/config/EquipoView';


type ModalProps = {
	idEquipo: number | null;
	idTorneo: number | null;
	equipo: EquipoView;
	isOpen: boolean;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const TorneoJugadoresModal = ({
	idEquipo
	, idTorneo
	, equipo
	, isOpen
	, close
	, modalRef }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);

	const titulos = { "IdJugador": "#", "Apellido": "Apellido", "Nombre": "Nombre", "Habilitado": "Habilitado" };
	const classNames = { "IdJugador": "text-center", "Habilitado": "text-center" };
	const tipoCampo = { "Habilitado": "checkBox" };


	const [listaJugadores, setListaJugadores] = useState<TorneoEquipoJugadorType[] | null>(null);


	const fetchJugadores = () => {
		if (idTorneo) {
			if (idEquipo) {
				setContadorLoading(1);
				getJugadoresXTorneoEquipoService(idTorneo, idEquipo)
					.then((jugadoresList) => {
						setListaJugadores(jugadoresList);
					})
					.finally(() => { setContadorLoading(-1); })
			}
		}
	};


	useEffect(() => {
		if (isOpen) {
			fetchJugadores();
		}
	}, [isOpen]);


	const onCheck = async (e: ChangeEvent<HTMLInputElement>) => {
		/** Se arma el json para subir */
		const jsonData = {
			IdTorneo: idTorneo,
			IdEquipo: idEquipo,
			Habilitado: e.target.checked === true ? 1 : 0,
			IdJugador: Number(e.target.dataset.id)
		};
		const ret = await postTorneoEquipoJugadorCheckService(jsonData);
		if (ret.code === 200) {
			setListaJugadores((prevListaJugadores) =>
				(prevListaJugadores || []).map((jugador) =>
					jugador.IdJugador === Number(e.target.dataset.id) ? { ...jugador, Habilitado: jugador.Habilitado === false ? true : false } : jugador
				)
			);
		}
	}


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{equipo.Nombre}</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							{
								listaJugadores !== null
									?
									listaJugadores.length > 0
										?
										<Tabla
											datos={listaJugadores}
											titulos={titulos}
											classNames={classNames}
											keyField="IdJugador"
											tipoCampo={tipoCampo}
											onCheck={onCheck}
										/>
										:
										<h4>No hay jugadores cargados</h4>
									:
									<table className='sk'>
										<tbody>
											<tr ><td className='line'></td></tr>
											<tr ><td className='line'></td></tr>
											<tr ><td className='line'></td></tr>
											<tr ><td className='line'></td></tr>
										</tbody>
									</table>
							}
						</div>
						<div className="modal-footer" >
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								onClick={close}
								aria-label="Cerrar"> Cerrar</button >
						</div >
					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	)
}
