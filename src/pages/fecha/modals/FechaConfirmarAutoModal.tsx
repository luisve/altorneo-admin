import { useEffect, useState } from "react";
import QuickHelp from "../../../components/QuickHelp";
import { toast } from 'react-toastify';


import { getSedesListService } from "../../../services/config/SedesService";
import { getParticipantesFechaService } from "../../../services/fecha/FechaService";


import { DefaultFechaAutomaticaType, FechaAutomaticaItem, FechaAutomaticaType } from "../../../types/fecha/FechaAutomaticaType";
import { PartidoType, PartidoTypePost } from "../../../types/partido/PartidoType";
import { EquipoView } from "../../../views/config/EquipoView";


import { toDayMonthYear, toMySQLDate } from "../../../utils/formatDate";
import { postPartidosAutomaticoService } from "../../../services/fecha/PartidoService";
import { Loading } from "../../../components/Loading";


type ModalProps = {
	idTorneo: number;
	idFecha: number;
	listaPartidos: PartidoType[];
	listaEquipos: EquipoView[];
	fetchListaPartidos: (idFecha: number) => void;
	isOpen: boolean;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


const FechaConfirmarAutoModal = ({
	idTorneo
	, idFecha
	, listaPartidos
	, listaEquipos
	, fetchListaPartidos
	, isOpen
	, close
	, modalRef }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState<number>(0);

	// traer las sedes del campeonato
	// definir el rango horario
	// definir que tiempo dura cada partido


	// const [listaSedes, setListaSedes] = useState<SedeType[] | null>(null);
	// const [listaSedesItem, setListaSedesItem] = useState<FechaAutomaticaItem[]>([]);
	const [form, setForm] = useState<FechaAutomaticaType>(DefaultFechaAutomaticaType);
	const [partidosAsignados, setPartidosAsignados] = useState<PartidoType[]>([])
	const [listarAsignados, setListarAsignados] = useState<boolean>(false);
	const [errorOcupados, setErrorOcupados] = useState<boolean>(false);
	const [errorSede, setErrorSede] = useState<boolean>(false);
	// const [partidos, setPartidos] = useState<PartidoType[]>([]);


	useEffect(() => {
		setListarAsignados(false);
	}, [isOpen])

	const handleChangeSede = (idSede: number | null, campo: string, fecha?: string | null) => {
		setForm(prev => ({
			...prev,
			Sedes: prev.Sedes.map(sede => {
				if (sede.IdSede === idSede && campo === 'sede') { return { ...sede, Activa: !sede.Activa } }
				if (sede.IdSede === idSede && campo === 'desde' && fecha) { return { ...sede, Desde: fecha } }
				if (sede.IdSede === idSede && campo === 'hasta' && fecha) { return { ...sede, Hasta: fecha } }
				return sede;
			})
		}));
	}


	useEffect(() => {
		if (isOpen) {
			getSedesListService()
				.then((listaSedes) => {
					//const hoy = new Date();
					//const hoyString = hoy.toISOString().split("T")[0];
					const hoyString = new Date().toLocaleDateString('sv-SE');
					setForm(prev => ({
						...prev,
						Dia: hoyString,
						Sedes: listaSedes.map(sede => ({
							IdSede: sede.Id ?? 0
							, Nombre: sede.Nombre
							, Activa: true
							, Desde: '08:00'
							, Hasta: '20:00'
						}))
					}));
				})
		}
	}, [isOpen])


	const handleGenerar = () => {
		// primero obtener los participantes ocupados 
		setErrorOcupados(false);
		getParticipantesFechaService(idTorneo, idFecha, form.Dia)
			.then((listaParticipantes) => {
				let intentos = 0;
				let partidosAsignados: PartidoType[] = [];
				while (intentos < listaPartidos.length) {
					partidosAsignados = [];
					const horaAMinutos = (hora: string, sumarMinutos: number): number => {
						const [h, m] = hora.split(":").map(Number);
						return h * 60 + m + sumarMinutos;
					};
					let partidosList = listaPartidos;

					// armar array de sedes para los distintos intentos
					let listaSedes: FechaAutomaticaItem[] = form.Sedes;
					let indexSede = 0; // para ir iterando las sedes
					for (let j = 0; j < partidosList.length; j++) {
						const index = (intentos + j) % partidosList.length;
						let partido = partidosList[index];

						let sedeHabilitada = false;
						let intentosPorSede = 0;
						let desdeMin = 0;
						let hastaMin = 0;
						while (sedeHabilitada === false && intentosPorSede < listaSedes.length) {
							// chequear que la sede esté activa y tenga tiempo 
							desdeMin = horaAMinutos(listaSedes[indexSede].Desde, 0);
							hastaMin = horaAMinutos(listaSedes[indexSede].Hasta, 0);
							// Validar que el rango disponible alcance
							const rangoDisponible = hastaMin - desdeMin;
							if (rangoDisponible >= Number(form.DuracionPartido) && listaSedes[indexSede].Activa === true) {
								sedeHabilitada = true;
							} else {
								indexSede = indexSede === listaSedes.length - 1 ? 0 : indexSede + 1;
							}
							intentosPorSede++;
						}
						if (sedeHabilitada === true) {
							const limite = desdeMin + Number(form.DuracionPartido);
							const listaAsignadosAHora = listaParticipantes.asignados.filter(a => {
								const asignadoMinutosDesde = horaAMinutos(a.Hora, 0)
								const asignadoMinutosHasta = horaAMinutos(a.Hora, Number(form.DuracionPartido))
								return (
									(asignadoMinutosDesde >= desdeMin && asignadoMinutosDesde <= limite)
									|| (asignadoMinutosHasta >= desdeMin && asignadoMinutosHasta <= limite)
								)
							})
							const hayOcupados = listaAsignadosAHora.some(a => {
								return (
									listaParticipantes.libres.some(l => {
										return (
											l.Id === a.Id
											&& ((l.IdEquipo === partido.IdLocal) || (l.IdEquipo === partido.IdVisitante))
										)
									}))
							});
							/*
							const listaOcupados = listaAsignadosAHora.filter(a => {
								return (
									listaParticipantes.libres.some(l => {
										return (
											l.Id === a.Id
											&& ((l.IdEquipo === partido.IdLocal) || (l.IdEquipo === partido.IdVisitante))
										)
									}))
							});
							*/
							// console.log('intentos: ' + intentos + ', desdeMin: ' + desdeMin / 60);
							// console.log(listaOcupados);
							/*
							const hayOcupados = listaParticipantes.asignados.some((asignado) => {
								const asignadoMinutos = horaAMinutos(asignado.Hora, 0);
								return (
									(asignadoMinutos >= desdeMin && asignadoMinutos <= limite)
									&& listaParticipantes.libres.some(libre => libre.Id === asignado.Id && (asignado.IdEquipo === partido.IdLocal || asignado.IdEquipo === partido.IdVisitante))
								)
							});
							*/
							/*
							const existe = listaParticipantes.asignados.some(a => {
								const hora = horaAMinutos(a.Hora, 0);
								return (
									a.Id === 211 &&
									hora >= desdeMin &&
									hora <= hastaMin &&
									listaParticipantes.libres.some(l => l.Id === a.Id)
								);
							});
							*/
							if (!hayOcupados) {
								// if (listaOcupados.length === 0) {
								partido.Fecha = new Date(form.Dia + ' ' + listaSedes[indexSede].Desde);
								partido.IdSede = listaSedes[indexSede].IdSede;

								const nuevaHora = Math.floor((horaAMinutos(listaSedes[indexSede].Desde, form.DuracionPartido)) / 60) % 24;
								const nuevosMinutos = horaAMinutos(listaSedes[indexSede].Desde, form.DuracionPartido) % 60;
								listaSedes[indexSede].Desde = `${String(nuevaHora).padStart(2, '0')}:${String(nuevosMinutos).padStart(2, '0')}`;
								indexSede = indexSede === listaSedes.length - 1 ? 0 : indexSede + 1;
								partidosAsignados.push(partido);
							} else {
								// no se pudo cargar un partido, se resetea la asignación
								setErrorOcupados(true);
								// console.log('intentos: ' + intentos + ', desdeMin: ' + desdeMin / 60);
								// console.log(listaOcupados);
								j = partidosList.length + 5;
							}
						} else {
							// No hay sedes disponibles se sale de los bucles
							j = partidosList.length + 5;
							intentos = listaPartidos.length;
							setErrorSede(true);
						}
					}
					if (partidosAsignados.length === partidosList.length) {
						setErrorOcupados(false);
						setErrorSede(false);
						intentos = listaPartidos.length;
					}
					intentos++;
				}
				/*
				if ((intentos === listaPartidos.length) || (partidosAsignados.length !== listaPartidos.length)) {
					setErrorOcupados(true);
				}
				*/
				setPartidosAsignados(partidosAsignados);
				handleListarAsignados();
			})
	}

	const devolverEquipo = (idEquipo: number) => {
		const equipo = listaEquipos.find(equipo => equipo.Id === idEquipo);
		return equipo?.Nombre;
	}
	const devolverSede = (idSede: number) => {
		const sede = form.Sedes.find(sede => sede.IdSede === idSede);
		return sede?.Nombre;
	}
	const handleListarAsignados = () => {
		setListarAsignados(true);
	}


	const handleConfirmar = () => {
		// Guarda los partidos asignados
		const datosEnviar: PartidoTypePost[] = partidosAsignados.map(({ Id, Fecha, IdSede }) => ({
			Id
			, Fecha: toMySQLDate(Fecha)
			, IdSede
		}));
		setContadorLoading(1);
		postPartidosAutomaticoService(datosEnviar)
			.then((resp) => {
				if (resp.code === 200) {
					toast.success(resp.msg, { autoClose: 1000, });
					fetchListaPartidos(idFecha);
					close();
				} else {
					toast.error(resp.msg);
				}
			})
			.finally(() => { setContadorLoading(-1) })
	}


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Carga Automática de Fechas</h5>
							<button
								onClick={close}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Cerrar"></button>
						</div>
						<div className={listarAsignados ? 'modal-body' : 'modal-body d-none'}>
							<div className="row">
								<span className="h5">Partidos del día: <strong>{toDayMonthYear(form.Dia)}</strong></span>
								{
									errorSede === false && errorOcupados === false &&
									<table className='table table-hover text-nowrap table-striped'>
										<thead>
											<tr>
												<th className="text-center">Partido</th>
												<th>Local</th>
												<th>Visitante</th>
												<th>Hora</th>
												<th>Sede</th>
											</tr>
										</thead>
										<tbody>
											{
												listarAsignados &&
												partidosAsignados.map(partido => {
													return (
														<tr key={partido.Id}>
															<td className="text-center">{partido.Partido}</td>
															<td>{devolverEquipo(partido.IdLocal)}</td>
															<td>{devolverEquipo(partido.IdVisitante)}</td>
															<td>{`${partido.Fecha.getHours().toString().padStart(2, '0')}:${partido.Fecha.getMinutes().toString().padStart(2, '0')}`}</td>
															<td>{devolverSede(partido.IdSede ?? 0)}</td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
								}
								{
									errorSede === true || errorOcupados === true ?
										(
											<>
												{
													errorSede === true &&
													<div className="alert alert-warning" role="alert">
														No hay tiempo en las sedes para todos los partidos.
													</div>
												}
												{
													errorOcupados === true &&
													<div className="alert alert-warning" role="alert">
														No se han podido asignar los partidos en los distintos intentos porque hay participantes que están asignados en el mismo horario.
													</div>
												}
											</>
										)
										:
										(
											<span className="text-end">
												<button
													type="button"
													onClick={() => handleConfirmar()}
													className="btn btn-primary m-1 btn-sm">Confirmar</button>
											</span>
										)
								}
							</div>
						</div>
						<div className={!listarAsignados ? 'modal-body' : 'modal-body d-none'}>
							<div className="row">
								<div className="col-md-6">
									<div className="row">
										<label htmlFor="Dia" className="col-md-6 control-label">Dia</label>
										<div className='col-md-6'>
											<div className="row">
												<div className="col-md-10">
													<input
														type="date"
														className="form-control"
														id="Dia"
														name="Dia"
														placeholder="Dia"
														onChange={(e) => setForm(prev => ({ ...prev, Dia: e.target.value }))}
														value={form.Dia} />
												</div>
											</div>
										</div>
										<label htmlFor="DuracionPartido" className="col-md-6 control-label">Duración del partido</label>
										<div className='col-md-6'>
											<div className="row">
												<div className="col-md-10">
													<input
														type="number"
														className="form-control d-inline-block"
														id="DuracionPartido"
														name="DuracionPartido"
														placeholder="DuracionPartido"
														onChange={(e) => setForm(prev => ({ ...prev, DuracionPartido: Number(e.target.value) }))}
														value={form?.DuracionPartido} />
												</div>
												<div className="col-md-2">
													<QuickHelp helpText="El valor debe estar expresado en minutos y se debe tener en cuenta algún intervalo entre partidos, por ejemplo:
											2 tiempos de 40 minutos + 10 de descanso + 10 de intervalo hasta el próximo partido sería: 100." />
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex flex-row-reverse bd-highlight col-4 float-end">
										<button
											type="button"
											onClick={() => handleGenerar()}
											className="btn btn-primary m-1 btn-sm">Generar</button>
									</div>
								</div>
							</div>
							<table className='table table-hover text-nowrap table-striped'>
								<thead>
									<tr>
										<th>Sede</th>
										<th>Utilizar</th>
										<th>Desde</th>
										<th>Hasta</th>
									</tr>
								</thead>
								<tbody>
									{
										form.Sedes ?
											form.Sedes.map((sede) => {
												return (
													<tr key={sede.IdSede}>
														<td>{sede.Nombre}</td>
														<td className="text-center form-switch">
															<input
																className="form-check-input checkS mx-auto"
																type="checkbox"
																onChange={() => { handleChangeSede(sede.IdSede, 'sede') }}
																checked={sede.Activa === true} /></td>
														<td>
															<input
																type="time"
																className="form-control mb-0"
																step={900}
																onChange={(e) => { handleChangeSede(sede.IdSede, 'desde', e.target.value) }}
																disabled={!sede.Activa}
																value={sede.Desde} /></td>
														<td>
															<input
																type="time"
																className="form-control mb-0"
																step={300}
																onChange={(e) => { handleChangeSede(sede.IdSede, 'hasta', e.target.value) }}
																disabled={!sede.Activa}
																value={sede.Hasta} /></td>
													</tr>
												)
											})
											:
											<table className='table placeholder-glow'>
												<thead>
													<tr>
														<th className="text-center"><span>#</span></th>
														<th className=""><span>Nombre</span></th>
														<th className=""><span>Domicilio</span></th>
														<th className="text-center"><span>Imagen</span></th>
														<th></th>
													</tr>
												</thead>
												<tbody>
													{
														Array(5).fill(0).map((_, index) => (
															<tr key={index}>
																{
																	Array(6).fill(0).map((_, index) => (
																		<td key={index}><span className='w-100 placeholder'>&nbsp;</span></td>
																	))
																}
															</tr>
														))
													}
												</tbody>
											</table>
									}
								</tbody>
							</table>

						</div>
					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	)
}

export default FechaConfirmarAutoModal