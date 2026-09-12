import { useState, useEffect, useRef } from 'react';


import { Loading } from '../../components/Loading';
import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { SelectType } from '../../types/SelectType';
import { SancionType } from '../../types/fecha/SancionType';


import { getTorneosIniciadosSelectService } from '../../services/SelectService';
import { getSancionListaService } from '../../services/fecha/SancionService';


import { FechaTarjetasModal } from './modals/FechaSancionesModal';


export const FechaSanciones = () => {


	const [contadorLoading, setContadorLoading] = useState(0);


	const titulos = { "EquipoNombre": "Equipo", "JugadorNombre": "Jugador", "A": "Amarillas", "AAcumuladas": "A.Acumuladas", "R": "Rojas", "RAcumuladas": "R.Acumuladas" };
	const classNames = {};
	const tipoCampo = {};
	const botones = ["Edit"];


	const listaTorneos = useRef<SelectType[]>([]);
	const [idTorneo, setIdTorneo] = useState<number | null>(null);
	const [listaSancionesTabla, setListaSancionesTabla] = useState<SancionType[]>([]);
	const jsJugadorRef = useRef<SancionType[]>([])
	const [showModal, setShowModal] = useState(false);


	const onShowModalTarjetas = (value: boolean) => {
		if (value === false) {
			if (idTorneo) {
				getSansionLista(idTorneo);
			}
		}
		setShowModal(value);
	};


	// clic para abrir el modal
	const onEdit = (id: number) => {
		jsJugadorRef.current = listaSancionesTabla.filter(jugador => jugador.IdJugador === id);
		setShowModal(true);
	};


	// El número de fecha se pasa a 0 para que no descargue la primera fecha antes que el listado.
	const handleChangeIdTorneo = (idTorneo: number) => {
		setIdTorneo(idTorneo);
	}


	const getSansionLista = (idTorneo: number) => {
		getSancionListaService(idTorneo)
			.then((lista) => {
				setListaSancionesTabla(lista);
			});
	}


	useEffect(() => {
		if (idTorneo) {
			getSansionLista(idTorneo);
		}
	}, [idTorneo]);


	const fetchTorneos = () => {
		setContadorLoading(1);
		getTorneosIniciadosSelectService()
			.then((torneoList) => {
				listaTorneos.current = torneoList;
				handleChangeIdTorneo((torneoList.length > 0 ? torneoList[0].Id : 0));

			})
		setContadorLoading(-1);
	}


	useEffect(() => {
		fetchTorneos();
	}, [])


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="fecha sanciones" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Sanciones de Jugadores</h4>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row my-2">
							<div className="col-md-6">
								{
									listaTorneos.current.length > 0 &&
									<>
										<label htmlFor="IdTorneo">Torneos</label>
										<select
											className="form-select form-select-sm"
											onChange={(e) => { handleChangeIdTorneo(Number(e.target.value)) }}
											value={idTorneo || 0}
											id="IdTorneo"
											aria-label='Listado de equipos'>
											{
												listaTorneos.current.map((torneo, index) => {
													return (
														<option value={torneo.Id} key={index} >{torneo.Label}</option>
													)
												})
											}
										</select>
									</>
								}
							</div>
						</div>
						<div className="row my-2">
							<div className="col-md-6">
							</div>
						</div>
						<div className="tablaList">
							{
								listaSancionesTabla !== null && listaSancionesTabla.length > 0 ?
									<Tabla
										datos={listaSancionesTabla}
										titulos={titulos}
										botones={botones}
										classNames={classNames}
										keyField={"IdJugador"}
										tipoCampo={tipoCampo}
										onEdit={onEdit}
									/>
									:
									<div className="card shadow-sm">
										<div className="card-body text-center py-5">
											<h5 className="fw-bold">No Jugadores con tarjetas pendientes.</h5>
										</div>
									</div>
							}
						</div>
					</div>
				</div>
			</section>
			{
				showModal === true &&
				<FechaTarjetasModal
					show={showModal}
					onShow={onShowModalTarjetas}
					jsJugador={jsJugadorRef.current[0]}
					idTorneo={idTorneo || 0}
				/>
			}
			<Loading contador={contadorLoading} />
		</>
	)
}


export default FechaSanciones;