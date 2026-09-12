import { useState, useEffect, useCallback } from 'react';


import { URL_IMAGES, URL_UPLOAD } from '../../utils/constants';
import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { SelectType } from '../../types/SelectType';
import { FechaView } from '../../views/torneo/FechaView';


import { getEquiposHabilitados, getFechas } from '../../services/torneo/TorneoFechaService';
import { getTorneosCreadosSelectService } from '../../services/SelectService';


import { TorneoFechasModal } from './modals/TorneoFechasModal';
import { TorneoFechasManualModal } from './modals/TorneoFechasManualModal';


import { DefaultEquipoView, EquipoView } from '../../views/config/EquipoView';
import { useBootstrapModal } from '../../hooks/useBootstrapModal';


export const TorneoFechas = () => {


	const modalFixtureAutomatico = useBootstrapModal();
	const modalFixtureManual = useBootstrapModal()

	const titulos = { "FechaNumero": "Fecha", "Partido": "Partido", "Local": "Local", "Visitante": "Visitante", "Libre": "Libre" };
	const classNames = { "FechaNumero": "text-center fw-bold", "Partido": "text-center", "Local": "fw-bold", "Visitante": "fw-bold", "Libre": "fw-bold", "ImagenVisitante": "text-center" };
	const tipoCampo = { "ImagenLocal": "img", "ImagenVisitante": "img", 'Local': 'com_ImagenLocal:Local', 'Visitante': 'com_ImagenVisitante:Visitante' };


	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	const [idTorneo, setIdTorneo] = useState<number | null>(null);
	const [listaEquiposHabilitados, setListaEquiposHabilitados] = useState<EquipoView[] | null>(null);
	const [listaFechas, setListaFechas] = useState<FechaView[] | null>(null);
	// fechas para la tabla
	const [listaFechasPrint, setListaFechasPrint] = useState<FechaView[] | null>([]);
	const [cantidadEquipos, setCantidadEquipos] = useState(0);


	useEffect(() => {
		if (listaFechasPrint === null) {
			if ((listaFechas !== null) && (listaEquiposHabilitados !== null)) {
				if ((listaFechas.length === 0) || (listaEquiposHabilitados.length === 0)) {
					setListaFechasPrint([]);
				} else {
					modalFixtureAutomatico.close();
					let fechasTemp: FechaView[] = [];
					let nFecha: number | null = 0;
					let nPartido: number | null = 0;
					let zona = "U";
					listaFechas.forEach((fecha) => {
						if (zona !== fecha.Zona) {
							zona = fecha.Zona || "";
							if (fecha.Zona !== "U") {
								fechasTemp.push({ FechaNumero: null, Partido: null, Local: "ZONA " + fecha.Zona, Visitante: "", Libre: "", ImagenLocal: "", ImagenVisitante: "" });
							} else {
								fechasTemp.push({ FechaNumero: null, Partido: null, Local: "", Visitante: "", Libre: "", ImagenLocal: "", ImagenVisitante: "" });
							}
						}
						if (nFecha !== fecha.FechaNumero) {
							if (fecha.IdEquipoLibre !== 0) {
								// se imprime el primer renglon, fecha y equipo libre
								if (listaEquiposHabilitados !== null) {
									let sLibreNombre = listaEquiposHabilitados.find(e => e.Id === fecha.IdEquipoLibre)?.Nombre || '';
									fechasTemp.push({ FechaNumero: fecha.FechaNumero, Partido: null, Local: "", Visitante: "", Libre: sLibreNombre, ImagenLocal: "", ImagenVisitante: "" });
								}
							} else {
								fechasTemp.push({ FechaNumero: fecha.FechaNumero, Partido: null, Local: "", Visitante: "", Libre: "", ImagenLocal: "", ImagenVisitante: "" });
							}
							nFecha = fecha.FechaNumero;
						}
						if ((nPartido !== fecha.Partido) || (nFecha !== fecha.FechaNumero)) {
							if (listaEquiposHabilitados !== null) {
								let sLocal = listaEquiposHabilitados.find(e => e.Id === fecha.IdLocal) as EquipoView || DefaultEquipoView;
								let sVisitante = listaEquiposHabilitados.find(e => e.Id === fecha.IdVisitante) as EquipoView || DefaultEquipoView;
								fechasTemp.push({
									"ImagenLocal": sLocal.ImagenPerfil ? URL_UPLOAD + sLocal.ImagenPerfil : URL_IMAGES + 'svg/escudo.svg',
									"ImagenVisitante": sVisitante.ImagenPerfil ? URL_UPLOAD + sVisitante.ImagenPerfil : URL_IMAGES + 'svg/escudo.svg',
									"FechaNumero": null,
									"Partido": fecha.Partido,
									"Local": sLocal.Nombre,
									"Visitante": sVisitante.Nombre,
									"Libre": ""
								});
							}
							nPartido = fecha.Partido;
						}
					});
					setListaFechasPrint(fechasTemp);
				}
			}
		}
	}, [listaFechas, listaEquiposHabilitados, listaFechasPrint]);


	const fetchFixture = useCallback(() => {
		if (idTorneo !== null) {
			Promise.all([getEquiposHabilitados(idTorneo), getFechas(idTorneo)])
				.then(([listaEquiposHabilitados, listaFechas]) => {
					setListaEquiposHabilitados(listaEquiposHabilitados);
					setCantidadEquipos(listaEquiposHabilitados.length);
					setListaFechasPrint(null);
					setListaFechas(listaFechas);
				});
		}
	}, [idTorneo]);


	useEffect(() => {
		if (idTorneo) {
			fetchFixture();
		}
	}, [idTorneo])


	const handleChangeIdTorneo = (id: number) => {
		setListaFechas(null);
		setListaFechasPrint(null);
		setIdTorneo(id);
	}


	const fetchTorneos = async () => {
		const torneoList = await getTorneosCreadosSelectService();
		setListaTorneos(torneoList);
		setIdTorneo(torneoList.length > 0 ? torneoList[0].Id : null);
	};
	useEffect(() => {
		fetchTorneos();
	}, [])


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="torneo fechas" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Fechas del Torneo</h4>
							</div>
						</div>
					</div>
					<div className="container">
						{
							listaTorneos
								?
								listaTorneos.length > 0
									?
									<>
										<div className="row my-2">
											<div className="col-md-6">
												<label htmlFor="IdTorneo" className="form-label">Torneos</label>
												<select
													className="form-select form-select-sm"
													onChange={(e) => { handleChangeIdTorneo(Number(e.target.value)); }}
													id='IdTorneo'
													value={idTorneo || 0}
													aria-label='Listado de Torneos'>
													{
														listaTorneos.map((torneo, index) => {
															return (
																<option value={torneo.Id} key={index} >{torneo.Label}</option>
															)
														})
													}
												</select>
											</div>
											<div className="col-md-6">
												<label className="form-label">Fixture</label>
												{
													listaEquiposHabilitados &&
													listaEquiposHabilitados.length > 0 && cantidadEquipos > 3 &&
													<div className="d-flex gap-2">
														<button
															disabled={listaEquiposHabilitados.length % 2 !== 0}
															onClick={() => { modalFixtureManual.open() }}
															type="button"
															className="btn btn-primary btn-sm w-25">Manual</button>
														<button
															onClick={() => { modalFixtureAutomatico.open() }}
															type="button"
															className="btn btn-primary btn-sm  w-25">Automático</button>
													</div>
												}
											</div>
										</div>
										{
											listaFechasPrint
												?
												listaFechasPrint.length > 0
													?
													/** Descargó el fixture, se imprime */
													<div className="tablaList">
														<Tabla
															datos={listaFechasPrint || []}
															titulos={titulos}
															classNames={classNames}
															keyField={"0"}
															tipoCampo={tipoCampo}
															paginadoParam={1000}
															verPaginador={false}
														/>
													</div>
													:
													// El fixture no tiene fechas
													cantidadEquipos > 3
														?
														// Los equipos Alcanzan pero no se han generado fechas
														<div className="card shadow-sm">
															<div className="card-body text-center py-5">
																<h5 className="fw-bold">
																	No se han generado Fechas para este torneo, haga clic en los botones para generarlas de acuerdo a su preferencia, Manual o Automático.
																</h5>
															</div>
														</div>
														:
														// No hay suficientes equipos
														<div className="card shadow-sm">
															<div className="card-body text-center py-5">
																<h5 className="fw-bold">
																	Genere torneos de mayor cantidad de equipos, si agregó equipos luego de generar el torneo puede recargarlos desde el menú Torneo - Equipos.
																</h5>
															</div>
														</div>
												:
												// Se está cargando el fixture
												<table className='table placeholder-glow'>
													<thead>
														<tr>
															<th className="text-center fw-bold"><span>Fecha</span></th>
															<th className="text-center"><span>Partido</span></th>
															<th className="fw-bold"><span>Local</span></th>
															<th className="fw-bold"><span>Visitante</span></th>
															<th className="fw-bold"><span>Libre</span></th>
														</tr>
													</thead>
													<tbody>
														{
															Array(5).fill(0).map((_, index) => (
																<tr key={index}>
																	{
																		Array(5).fill(0).map((_, index) => (
																			<td key={index}><span className='w-100 placeholder'>&nbsp;</span></td>
																		))
																	}
																</tr>
															))
														}
													</tbody>
												</table>
										}
									</>
									:
									// No hay torneos, se muestra el mensaje 
									<div className="card shadow-sm">
										<div className="card-body text-center py-5">
											<h5 className="fw-bold">
												No hay torneos creados para generar las fechas
											</h5>
										</div>
									</div>
								:
								// Se estan cargando los torneos 
								<div className='placeholder-glow'>
									<span className='w-100 placeholder'>&nbsp;</span>
								</div>
						}
					</div>
				</div>
			</section >
			<TorneoFechasModal
				idTorneo={idTorneo}
				fetchFixture={fetchFixture}
				cantidadEquipos={cantidadEquipos}
				close={modalFixtureAutomatico.close}
				modalRef={modalFixtureAutomatico.ref}
			/>
			<TorneoFechasManualModal
				idTorneo={idTorneo || null}
				listaEquipos={listaEquiposHabilitados ?? []}
				fetchFixture={fetchFixture}
				close={modalFixtureManual.close}
				isOpen={modalFixtureManual.isOpen}
				modalRef={modalFixtureManual.ref}
			/>
		</>
	)
}


export default TorneoFechas;