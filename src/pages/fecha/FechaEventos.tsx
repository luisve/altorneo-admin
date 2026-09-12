import { useState, useEffect, useCallback, useRef } from 'react';


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { getSedeSelectService, getTorneosIniciadosSelectService } from '../../services/SelectService';
import { getListaFechaService } from '../../services/fecha/FechaService';
import { getEquiposXTorneoService } from '../../services/torneo/TorneoEquipoService';
import { getPartidoListaService } from '../../services/fecha/PartidoService';


import { SelectType } from '../../types/SelectType';
import { FechaType } from '../../types/fecha/FechaType';
import { PartidoPrintView } from '../../views/partido/PartidoPrintView';
import { EquipoView } from '../../views/config/EquipoView';


import { toDayMonthYearTime } from '../../utils/formatDate';


import { API } from '../../utils/constants';


import { FechaEventosModal } from './modals/FechaEventosModal';


export const FechaEventos = () => {


	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	//const jsonListaFechas = useRef<FechaType[] | null>(null);
	const [jsonListaFechas, setJsonListaFechas] = useState<FechaType[] | null>(null);
	//const [fechaNumero, setFechaNumero] = useState(0);
	const [idFecha, setIdFecha] = useState<number>(0);
	const [idTorneo, setIdTorneo] = useState(0);
	const listaEquipos = useRef<EquipoView[]>([]);
	const listaSedes = useRef<SelectType[]>([]);
	const [partido, setPartido] = useState<PartidoPrintView>();
	const [listaRender, setListaRender] = useState<PartidoPrintView[] | null>(null);


	const titulos = { "Zona": "Zona", "Partido": "#", "Fecha": "Fecha", "EquipoLocal": "Local", "EquipoVisitante": "Visitante", "Sede": "Sede" };
	const classNames = { "Partido": "text-center" };
	const tipoCampo = {};
	const botones = ["Edit"];


	const onEdit = (partidoNumero: number) => {
		if (listaRender) {
			const par = listaRender.find(p => p.Partido === partidoNumero);
			setPartido(par);
			setShowModal(true);
		}
	};


	const [showModal, setShowModal] = useState(false);
	const onShow = (value: boolean) => {
		setShowModal(value);
	};


	useEffect(() => {
		const fetchListaPartido = async () => {
			const partidoLista = await getPartidoListaService(idFecha);

			// se obtiene un array de zonas únicas
			// Extraemos y filtramos zonas únicas
			/*
			const listaZonas = partidoLista
				.map(item => item.Zona)
				.filter((zona, index, self) => self.indexOf(zona) === index)
				.map(zona => ({ Zona: zona }));
			*/
			const listaRenderTemp: PartidoPrintView[] = [];

			let zonaActual = "";
			partidoLista.forEach(partido => {
				let equipoLocal = "";
				let equipoVisitante = "";
				let fecha = "";

				listaEquipos.current.forEach(equipo => {
					if (partido.IdLocal === equipo.Id) { equipoLocal = equipo.Nombre; }
					if (partido.IdVisitante === equipo.Id) { equipoVisitante = equipo.Nombre; }
				});
				fecha = toDayMonthYearTime(partido.Fecha ? partido.Fecha.toString() : "S/D") || "S/D";
				if (zonaActual !== partido.Zona) {
					zonaActual = partido.Zona || "";
					if (zonaActual !== "U") {
						listaRenderTemp.push({
							Id: 0,
							Partido: 0,
							Zona: "Zona " + zonaActual,
							EquipoLocal: "",
							EquipoVisitante: "",
							Sede: "",
							LinkPDF: "",
							Fecha: "",
							IdLocal: partido.IdLocal,
							IdVisitante: partido.IdVisitante
						});
					}
				}
				const sede = listaSedes.current.find(sede => sede.Id === partido.IdSede);
				listaRenderTemp.push({
					Id: partido.Id ?? 0,
					Partido: partido.Partido,
					Fecha: fecha,
					EquipoLocal: equipoLocal,
					EquipoVisitante: equipoVisitante,
					Sede: sede?.Label || "S/D",
					LinkPDF: API + "admin/FechaConfirmarPDFListaBuenaFe?IdPartido=" + partido.Id,
					IdLocal: partido.IdLocal,
					IdVisitante: partido.IdVisitante
				});

			});
			setListaRender(listaRenderTemp);
		}

		if ((idFecha > 0) && (idTorneo > 0)) {
			fetchListaPartido();
		}
	}, [idTorneo, idFecha])



	useEffect(() => {
		const fetchFechasYEquipos = async () => {
			Promise.all([getListaFechaService(idTorneo), getEquiposXTorneoService(idTorneo), getSedeSelectService()])
				.then(([fechaList, equipoList, sedeSelectList]) => {
					listaEquipos.current = equipoList;
					listaSedes.current = sedeSelectList;
					if (fechaList[0].FechaNumero !== null) {
						handleCambioIdFecha(fechaList[0].FechaZona ? fechaList[0].FechaZona[0].IdFecha : 0);
					}
					setListaRender(null);
					setJsonListaFechas(fechaList);
					//jsonListaFechas.current = fechaList;
				});
		}
		if (idTorneo > 0) {
			fetchFechasYEquipos();
			setListaRender(null);
			//setJsonListaFechas(null);
			//jsonListaFechas.current = null;
		}
	}, [idTorneo]);

/*
	const handleCambioFecha = (fechaNumero: number) => {
		setListaRender(null);
		//jsonListaFechas.current = null;
		setFechaNumero(fechaNumero);
	};
*/

	const handleCambioIdFecha = (idFecha: number) => {
		setListaRender(null);
		//jsonListaFechas.current = null;
		setIdFecha(idFecha);
	};


	const handleChangeIdTorneo = (idTorneo: number) => {
		setListaRender(null);
		setJsonListaFechas(null);
		//jsonListaFechas.current = null;
		setIdTorneo(idTorneo);
	};


	const fetchTorneos = useCallback(async () => {
		const torneoList = await getTorneosIniciadosSelectService();
		setListaTorneos(torneoList);
		handleChangeIdTorneo(torneoList.length > 0 ? torneoList[0].Id : 0);
	}, []);


	useEffect(() => {
		localStorage.removeItem('listaJugadores');
		fetchTorneos();
	}, [fetchTorneos])


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="fecha eventos" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Eventos de Partidos</h4>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row my-2">
							<div className="col-md-6">
								{
									listaTorneos !== null
										?
										listaTorneos.length > 0 &&
										<>
											<label htmlFor="IdTorneo">Torneos</label>
											<select
												className="form-select form-select-sm"
												onChange={(e) => { handleChangeIdTorneo(Number(e.target.value)) }}
												value={idTorneo}
												id="IdTorneo"
												aria-label='Listado de equipos'>
												{
													listaTorneos.map((torneo, index) => {
														return (
															<option value={torneo.Id} key={index} >{torneo.Label}</option>
														)
													})
												}
											</select>
										</>
										:
										// Se estan cargando los torneos 
										<div className='placeholder-glow'>
											<span className='w-100 placeholder'>&nbsp;</span>
										</div>
								}
							</div>
						</div>
						{

							listaTorneos !== null &&
								listaTorneos.length > 0 ?
								<>
									<div className="col my-3">
										<h3>Fechas</h3>
										<div className="btn-group d-flex justify-content-cente">
											{
												jsonListaFechas
													?
													jsonListaFechas.length > 0 &&
													jsonListaFechas.map((fecha, index) => {
														return (
															<button
																key={index}
																type="button"
																onClick={((e) => handleCambioIdFecha(Number(e.currentTarget.dataset.idfecha)))}
																className={`btn btn-sm ${(fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0) === idFecha ? "btn-primary" : "btn-outline-primary"}`}
																data-idfecha={fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0}
																>{fecha.FechaNumero}</button>
														)
													})
													:
													// Se estan cargando las fechas
													<div className='placeholder-glow w-100'>
														<span className='w-100 placeholder'>&nbsp;</span>
													</div>
												/*
												onClick={((e) => handleCambioFecha(Number(e.currentTarget.dataset.fechanumero)))}
												data-fechanumero={fecha.FechaNumero}
												*/
											}
										</div>
									</div>
									<div className="tablaList">
										{
											listaRender
												?
												<Tabla
													datos={listaRender}
													titulos={titulos}
													botones={botones}
													classNames={classNames}
													keyField="Partido"
													onEdit={onEdit}
													tipoCampo={tipoCampo}
												/>
												:
												<table className='table placeholder-glow'>
													<thead>
														<tr>
															<th className=""><span>Zona</span></th>
															<th className="text-center"><span>#</span></th>
															<th className=""><span>Fecha</span></th>
															<th className=""><span>Local</span></th>
															<th className=""><span>Visitante</span></th>
															<th className=""><span>Sede</span></th>
															<th></th>
														</tr>
													</thead>
													<tbody>
														{
															Array(5).fill(0).map((_, index) => (
																<tr key={index}>
																	{
																		Array(7).fill(0).map((_, index) => (
																			<td key={index}><span className='w-100 placeholder'>&nbsp;</span></td>
																		))
																	}
																</tr>
															))
														}
													</tbody>
												</table>
										}
									</div>
								</>
								:
								<div className="card shadow-sm">
									<div className="card-body text-center py-5">
										<h5 className="fw-bold">
											No se han generado los partidos.
										</h5>
									</div>
								</div>
						}
					</div>
				</div>
			</section>
			{
				((partido !== undefined) && (idTorneo !== 0)) &&
				<FechaEventosModal
					show={showModal}
					onShow={onShow}
					partido={partido}
					idTorneo={idTorneo}
				/>
			}
		</>
	)
}


export default FechaEventos;