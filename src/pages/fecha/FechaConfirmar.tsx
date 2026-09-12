import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import QuickHelp from '../../components/QuickHelp';


import { Loading } from '../../components/Loading';
import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';


import { FechaType } from '../../types/fecha/FechaType';
import { SelectType } from '../../types/SelectType';
//import { EquipoType } from '../../types/config/EquipoType';
import { DefaultPartidoType, PartidoType } from '../../types/partido/PartidoType';
import { ZonaType } from '../../types/torneo/ZonaType';


import { getJuezSelectService, getSedeSelectService, getTorneosIniciadosSelectService } from '../../services/SelectService';
import { getListaFechaService } from '../../services/fecha/FechaService';
import { getEquiposXTorneoService } from '../../services/torneo/TorneoEquipoService';
import { getPartidoListaService, postPartidoDatosService } from '../../services/partido/PartidoService';
import { EquipoView } from '../../views/config/EquipoView';


export const FechaConfirmar = () => {


	const [contadorLoading, setContadorLoading] = useState<number>(0);


	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	const [idTorneo, setIdTorneo] = useState<number>(0);
	const [listaSedes, setListaSedes] = useState<SelectType[] | null>(null);
	const [listajueces, setListaJueces] = useState<SelectType[] | null>(null);
	const [listaFechas, setListaFechas] = useState<FechaType[]>([]);
	//const [fechaNumero, setFechaNumero] = useState<number>(0);
	const [idFecha, setIdFecha] = useState<number | null>(null);
	const [listaEquipos, setListaEquipos] = useState<EquipoView[]>([]);
	const [listaPartidos, setListaPartidos] = useState<PartidoType[] | null>(null);
	const [listaZonas, setListaZonas] = useState<ZonaType[] | null>([]);
	const [listaPartidosRender, setListaPartidosRender] = useState<PartidoType[] | null>(null);
	const [zona, setZona] = useState<string>("U");
	const [idPartido, setIdPartido] = useState<number>(0);
	const [equipoLocalTexto, setEquipoLocalTexto] = useState("");
	const [equipoVisitanteTexto, setEquipoVisitanteTexto] = useState("");
	const [eqipoLibreTexto, setEquipoLibreTexto] = useState("");


	const [form, setForm] = useState<PartidoType>(DefaultPartidoType);
	const formChange = (data: Record<string, any>) => {
		setForm((prevForm) => ({
			...prevForm,
			...data
		}));
	};


	// Se cargan los datos para el formulario
	useEffect(() => {
		if ((idPartido > 0) && (listaPartidosRender !== null)) {
			const partido: PartidoType = listaPartidosRender.filter(p => p.Id === idPartido)[0];
			partido.Fecha = partido.Fecha === null ? new Date() : partido.Fecha;
			formChange(partido);
			if (listaFechas.length > 0) {
				let fechaActual = listaFechas.find(fecha => (fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0) === idFecha);
				const getNombreById = (id: number) => listaEquipos.find(d => d.Id === id)?.Nombre || "";
				setEquipoLocalTexto(getNombreById(partido.IdLocal));
				setEquipoVisitanteTexto(getNombreById(partido.IdVisitante));
				if (fechaActual?.IdEquipoLibre != null) {
					setEquipoLibreTexto("Libre : " + getNombreById(fechaActual.IdEquipoLibre));
				}
			}
		}
	}, [idPartido, idFecha, listaEquipos, listaFechas, listaPartidosRender]);


	useEffect(() => {
		if ((zona !== "") && (listaPartidos !== null)) {
			setListaPartidosRender(listaPartidos.filter(partido => partido.Zona === zona));
			setIdPartido(listaPartidos.filter(partido => partido.Zona === zona)[0].Id || 0);
		}
	}, [zona, listaPartidos])


	useEffect(() => {
		const fetchListaPartido = async (idFecha: number) => {
			const partidoLista = await getPartidoListaService(idFecha);
			setListaPartidos(partidoLista);
			// se obtiene un array de zonas únicas
			// Extraemos y filtramos zonas únicas
			const resultado = partidoLista
				.map(item => item.Zona)
				.filter((zona, index, self) => self.indexOf(zona) === index)
				.map(zona => ({ Zona: zona }));
			setListaZonas(resultado);
			setZona(partidoLista[0].Zona);
		}

		setListaPartidos(null);
		setListaPartidosRender(null);
		setListaZonas(null);
		setZona("");

		//if ((fechaNumero > 0) && (idTorneo > 0)) {
		if (idFecha) {
			fetchListaPartido(idFecha);
		}
	}, [idFecha]);


	useEffect(() => {
		const fetchFechasYEquipos = async () => {
			setContadorLoading(1);
			Promise.all([getListaFechaService(idTorneo), getEquiposXTorneoService(idTorneo)])
				.then(([fechaList, equipoList]) => {
					setListaFechas(fechaList);
					if (fechaList[0].FechaZona) {
						setIdFecha(fechaList[0].FechaZona[0].IdFecha);
					}
					setListaEquipos(equipoList);
					setContadorLoading(-1);
				});
		}

		if (idTorneo > 0) {
			fetchFechasYEquipos();
		} else {
			setListaFechas([]);
		}

	}, [idTorneo])


	const fetchTorneos = async () => {
		const torneoList = await getTorneosIniciadosSelectService();
		setListaTorneos(torneoList);
		setIdTorneo(torneoList.length > 0 ? torneoList[0].Id : 0);
		const sedeList = await getSedeSelectService();
		setListaSedes(sedeList);
		const juezList = await getJuezSelectService();
		setListaJueces(juezList);
	};


	useEffect(() => {
		setContadorLoading(1);
		fetchTorneos();
		setContadorLoading(-1);
	}, [])


	const actualizarDatosLocal = () => {
		// Se actualizan los datos en el formulario
		if (listaPartidos !== null) {
			const nuevaLista = listaPartidos.map(partido =>
				partido.Id === idPartido ? { ...partido, ...form } : partido
			);
			setListaPartidos(nuevaLista);
		}
	}


	const onClicPost = async () => {
		setContadorLoading(1);
		const ret = await postPartidoDatosService(form);
		if (ret.code === 200) {
			toast.success(ret.msg, { autoClose: 1000, });
			actualizarDatosLocal();
		}
		setContadorLoading(-1);
	};


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="fechac onfirmar" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Fecha Confirmar Datos</h4>
							</div>
						</div>
					</div>
					<div className="container">
						{
							listaTorneos !== null
								?
								listaTorneos.length > 0
									?
									<>
										<div className="row my-2">
											<div className="col-md-6">
												<label htmlFor="IdTorneo">Torneos</label>
												<select
													className="form-select form-select-sm"
													onChange={(e) => { setIdTorneo(Number(e.target.value)) }}
													value={idTorneo}
													id="IdTorneo"
													name="IdTorneo"
													aria-label='Listado de equipos'>
													{
														listaTorneos.map((torneo, index) => {
															return (
																<option value={torneo.Id} key={index} >{torneo.Label}</option>
															)
														})
													}
												</select>

											</div>
										</div>
										<div className="col my-3">
											<h3>Fechas</h3>
											<div className="btn-group d-flex justify-content-center">
												{
													listaFechas !== null
														?
														listaFechas.map((fecha, index) => {
															return (
																<button
																	key={index}
																	type="button"
																	onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																		setIdFecha(Number(e.currentTarget.dataset.idfecha));
																	}}
																	className={`btn btn-sm ${(fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0) === idFecha ? "btn-primary" : "btn-outline-primary"}`}
																	title={"Editar fecha " + fecha.FechaNumero}
																	data-idfecha={fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0}>
																	{fecha.FechaNumero}</button>
															)
														})
														:
														// Se estan cargando las fechas
														<div className='placeholder-glow'>
															<span className='w-100 placeholder'>&nbsp;</span>
														</div>
												}
											</div>
										</div>
										{
											listaZonas !== null &&
											listaZonas.length > 1 &&
											<div className="col my-3">
												<h3>Zonas</h3>
												<div className="btn-group d-flex justify-content-cente">
													{
														listaZonas.map((zonaActual, index) => {
															return (
																<button
																	key={index}
																	type="button"
																	onClick={((e) => {
																		setZona(e.currentTarget.textContent || "");
																	})}
																	className={`btn btn-sm ${zonaActual.Zona === zona ? "btn btn-primary" : "btn btn-outline-primary"}`}
																>{zonaActual.Zona}</button>
															)
														})
													}
												</div>
											</div>
										}
										<div className="col my-3">
											<h3>Partidos</h3>
											<div className="btn-group d-flex justify-content-cente">
												{
													listaPartidosRender !== null
														?
														listaPartidosRender.map((partido, index) => {
															return (
																<button
																	key={index}
																	type="button"
																	onClick={((e) => { setIdPartido(Number(e.currentTarget.dataset.idpartido)) })}
																	className={`btn btn-sm ${partido.Id === idPartido ? "btn btn-primary" : "btn btn-outline-primary"}`}
																	data-idpartido={partido.Id}>{partido.Partido}</button>
															)
														})
														:
														<table className='sk'>
															<tbody>
																<tr>
																	<td className='line'></td><td className='line'></td><td className='line'></td><td className='line'></td>
																</tr>
															</tbody>
														</table>
												}
											</div>
										</div>
										{
											listaPartidosRender !== null ?

												<div className="col my-3">
													<span style={{ color: '#000' }}>
														<h5 className='fw-bold'>
															{eqipoLibreTexto}
														</h5>
													</span>
													<div className="card">
														<div className="card-header">
															<div className="col-sm-5 float-start"><span style={{ color: '#000' }}><h5 className='fw-bold'>{equipoLocalTexto}</h5></span></div>
															<div className="col-sm-2 float-start text-center"><h5>vs.</h5></div>
															<div className="col-sm-5 float-start text-end"><span style={{ color: '#000' }}><h5 className='fw-bold'>{equipoVisitanteTexto}</h5></span></div>
														</div>
														<div className="card-body">
															<div className="col-12">
																<div className="row">
																	<div className="col">
																		<div className="form-group">
																			<label htmlFor="Fecha" className="control-label">Fecha</label>
																			<div className="row">
																				<div className="col-8">
																					<input
																						type="datetime-local"
																						className="form-control"
																						step={300}
																						value={form.Fecha.toString().slice(0, 16).replace(" ", "T")}
																						onChange={(e) => formChange({ "Fecha": e.target.value })}
																						min={new Date().toISOString().slice(0, 16)} />
																				</div>
																				<div className="col 4">
																					<div className="form-check form-switch">
																						<input
																							className="form-check-input checkS mx-auto"
																							onChange={(e) => formChange({ "checkFecha": e.target.checked })}
																							checked={form.checkFecha === true}
																							type="checkbox"
																							title="Toda la fecha"
																							data-bs-original-title="Toda la fecha"
																							aria-label="Toda la fecha" />
																						<QuickHelp helpText="Con esta opción se guarda el mismo dato para todos los partidos de la fecha." />
																					</div>
																				</div>
																			</div>
																		</div>
																		<div className="form-group">
																			<label htmlFor="IdSede" className="control-label">Sede</label>
																			<div className="row">
																				<div className="col-8">
																					<select
																						value={form.IdSede}
																						onChange={(e) => formChange({ "IdSede": Number(e.target.value) })}
																						className="form-select"
																						id="IdSede"
																						name="IdSede">
																						<option key="0" value="0"> No seleccionado</option>
																						{
																							listaSedes !== null &&
																							listaSedes.map((sede, index) => {
																								return (
																									<option key={index + 1} value={sede.Id}>{sede.Label}</option>
																								)
																							})
																						}
																					</select>
																				</div>
																				<div className="col-4">
																					<div className="form-check form-switch">
																						<input
																							className="form-check-input checkS mx-auto"
																							type="checkbox"
																							onChange={(e) => formChange({ "checkSede": e.target.checked })}
																							checked={form.checkSede === true}
																							title="Toda la fecha"
																							data-bs-original-title="Toda la fecha"
																							aria-label="Toda la fecha" />
																						<QuickHelp helpText="Con esta opción se guarda la misma sede para todos los partidos de la fecha." />
																					</div>
																				</div>
																			</div>
																		</div>
																		<div className="form-group">
																			<label htmlFor="IdJuez" className="control-label">Juez</label>
																			<div className="row">
																				<div className="col-8">
																					<select
																						className="form-select"
																						value={form.IdJuez}
																						onChange={(e) => { formChange({ "IdJuez": Number(e.target.value) }) }}>
																						<option key="0" value="0"> No seleccionado</option>
																						{
																							listajueces !== null &&
																							listajueces.map((juez, index) => {
																								if ((juez.Id !== form.IdJuezL1) && (juez.Id !== form.IdJuezL2)) {
																									return (
																										<option key={index + 1} value={juez.Id}>{juez.Label}</option>
																									)
																								} else {
																									return null;
																								}
																							})
																						}
																					</select>
																				</div>
																				<div className="col-4">
																					<div className="form-check form-switch">
																						<input
																							className="form-check-input checkS mx-auto"
																							type="checkbox"
																							checked={form.checkJuez === true}
																							title="Toda la Fecha"
																							onChange={(e) => formChange({ "checkJuez": e.target.checked })}
																							data-bs-original-title="Toda la fecha"
																							aria-label="Toda la fecha" />
																						<QuickHelp helpText="Con esta opción se guarda el mismo juez para todos los partidos de la fecha." />
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																	<div className="col">
																		<div className="form-group">
																			<label htmlFor="IdJuezL1" className="control-label">Juez L. 1</label>
																			<div className="row">
																				<div className="col-8">
																					<select
																						className="form-select"
																						value={form.IdJuezL1}
																						onChange={(e) => { formChange({ "IdJuezL1": Number(e.target.value) }) }}>
																						<option key="0" value="0"> No seleccionado</option>
																						{
																							listajueces !== null &&
																							listajueces.map((juez, index) => {
																								if ((juez.Id !== form.IdJuez) && (juez.Id !== form.IdJuezL2)) {
																									return (
																										<option key={index + 1} value={juez.Id}>{juez.Label}</option>
																									);
																								} else {
																									return null;
																								}
																							})
																						}
																					</select>
																				</div>
																				<div className="col-4">
																					<div className="form-check form-switch">
																						<input
																							className="form-check-input checkS mx-auto"
																							type="checkbox"
																							checked={form.checkJuezL1 === true}
																							onChange={(e) => formChange({ "checkJuezL1": e.target.checked })}
																							title="Toda la Fecha"
																							data-bs-original-title="Toda la fecha"
																							aria-label="Toda la fecha" />
																						<QuickHelp helpText="Con esta opción se guarda el mismo juez de línea 1 para todos los partidos de la fecha." />
																					</div>
																				</div>
																			</div>
																		</div>
																		<div className="form-group">
																			<label htmlFor="IdJuezL2" className="control-label">Juez L. 2</label>
																			<div className="row">
																				<div className="col-8">
																					<select
																						className="form-select"
																						value={form.IdJuezL2}
																						onChange={(e) => { formChange({ "IdJuezL2": Number(e.target.value) }) }}>
																						<option key="0" value="0"> No seleccionado</option>
																						{
																							listajueces !== null &&
																							listajueces.map((juez, index) => {
																								if ((juez.Id !== form.IdJuezL1) && (juez.Id !== form.IdJuez)) {
																									return (
																										<option key={index + 1} value={juez.Id}>{juez.Label}</option>
																									);
																								} else {
																									return null;
																								}
																							})
																						}
																					</select>
																				</div>
																				<div className="col-4">
																					<div className="form-check form-switch">
																						<input
																							className="form-check-input checkS mx-auto"
																							type="checkbox"
																							checked={form.checkJuezL2 === true}
																							onChange={(e) => formChange({ "checkJuezL2": e.target.checked })}
																							title="Toda la fecha"
																							data-bs-original-title="Toda la fecha"
																							aria-label="Toda la fecha" />
																						<QuickHelp helpText="Con esta opción se guarda el mismo juez de línea 2 para todos los partidos de la fecha." />
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="modal-footer">
														<button
															type="button"
															className="btn btn-primary btn-sm float-end"
															onClick={onClicPost}
															aria-label="Cerrar">Confirmar</button>
													</div>
												</div>
												:
												<table className='sk'>
													<tbody>
														<tr ><td className='line'></td><td className='line'></td></tr>
														<tr ><td className='line'></td><td className='line'></td></tr>
														<tr ><td className='line'></td><td className='line'></td></tr>
													</tbody>
												</table>
										}
									</>
									:
									<>
										<div className="card shadow-sm">
											<div className="card-body text-center py-5">
												<h5 className="fw-bold">
													No se han agregado torneos para iniciar, se puede hacer desde el menú Torneo - Alta.
												</h5>
												<p className="text-muted mb-4">
													En esta pantalla se cargan los datos de día, sede, juez de cada partidos para que los jugadores tengan la información.
												</p>
											</div>
										</div>
									</>
								:
								// Se estan cargando los torneos 
								<div className='placeholder-glow'>
									<span className='w-100 placeholder'>&nbsp;</span>
								</div>
						}
					</div>
				</div>
				<Loading contador={contadorLoading} />
			</section>
		</>
	)
}


export default FechaConfirmar;