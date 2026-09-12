import { useState, useEffect, useRef } from 'react';


import { API } from '../../utils/constants';
import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { toDayMonthYearTime } from '../../utils/formatDate';


import { getTorneosIniciadosSelectService } from '../../services/SelectService';
import { getListaFechaService } from '../../services/fecha/FechaService';
import { getEquiposXTorneoService } from '../../services/torneo/TorneoEquipoService';
import { getPartidoListaService } from '../../services/partido/PartidoService';


import { PartidoPrintView } from '../../views/partido/PartidoPrintView';
import { SelectType } from '../../types/SelectType';
import { FechaType } from '../../types/fecha/FechaType';
import { EquipoView } from '../../views/config/EquipoView';


export const FechaImprimir = () => {


	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	const [idTorneo, setIdTorneo] = useState<number>(0);
	const jsonListaFechas = useRef<FechaType[]>([]);
	const listaEquipos = useRef<EquipoView[]>([]);
	const listaSedes = useRef<SelectType[]>([]);
	const [listaPartidosRender, setListaPartidosRender] = useState<PartidoPrintView[] | null>(null);
	//const [fechaNumero, setFechaNumero] = useState<number | null>(null);
	const [idFecha, setIdFecha] = useState<number | null>(null);


	const titulos = { "Partido": "#", "Fecha": "Fecha", "EquipoLocal": "Local", "EquipoVisitante": "Visitante", "Sede": "Sede", "LinkPDF": "PDF" };
	const classNames = { "Partido": "text-center", "LinkPDF": "text-center" };
	const tipoCampo = { "LinkPDF": "pdf" };


	useEffect(() => {
		const fetchListaPartido = async (idFecha: number) => {
			const partidoLista = await getPartidoListaService(idFecha);
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
						listaRenderTemp.push({ Id: null, Partido: 0, Zona: "Zona " + zonaActual, EquipoLocal: "", EquipoVisitante: "", Sede: "", LinkPDF: "", Fecha: "" });
					}
				}
				const sede = listaSedes.current.find(sede => sede.Id === partido.IdSede);
				listaRenderTemp.push({ Id: null, Partido: partido.Partido, Fecha: fecha, EquipoLocal: equipoLocal, EquipoVisitante: equipoVisitante, Sede: sede?.Label || "S/D", LinkPDF: API + "Admin/fechaConfirmarPDFListaBuenaFe?idPartido=" + partido.Id });
			});
			setListaPartidosRender(listaRenderTemp);
		}
		if (idFecha) {
			fetchListaPartido(idFecha);
		}
	}, [idFecha]);


	const handleCambioFecha = (idFecha: number) => {
		setIdFecha(idFecha);
	};


	useEffect(() => {
		const fetchFechasYEquipos = async () => {
			Promise.all([getListaFechaService(idTorneo), getEquiposXTorneoService(idTorneo)])
				.then(([fechaList, equipoList]) => {
					jsonListaFechas.current = fechaList;
					if (fechaList[0].FechaNumero !== null) {
						handleCambioFecha(Number(jsonListaFechas.current[0].FechaZona ? jsonListaFechas.current[0].FechaZona[0].IdFecha : 0))
					}
					listaEquipos.current = equipoList;
				});
		}
		if (idTorneo > 0) {
			fetchFechasYEquipos();
		}
	}, [idTorneo])


	// El número de fecha se pasa a 0 para que no descargue la primera fecha antes que el listado.
	const handleChangeIdTorneo = (idTorneo: number) => {
		setListaPartidosRender(null);
		setIdTorneo(idTorneo);
	}


	useEffect(() => {
		const fetchTorneos = async () => {
			const torneoList = await getTorneosIniciadosSelectService();
			setListaTorneos(torneoList);
			if (torneoList.length > 0) {
				handleChangeIdTorneo(torneoList[0].Id);
			}
		};
		fetchTorneos();
	}, [])


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="fecha imprimir" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Imprimir Planillas</h4>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row my-2">
							{
								listaTorneos !== null
									?
									listaTorneos.length > 0 ?
										<div className="col-md-6">
											<label htmlFor="IdTorneo">Torneos</label>
											<select
												className="form-select form-select-sm"
												onChange={(e) => { handleChangeIdTorneo(Number(e.target.value)); }}
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
										</div>
										:
										<div className="card shadow-sm">
											<div className="card-body text-center py-5">
												<h5 className="fw-bold">
													No hay torneos en juego.
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
						{
							listaTorneos !== null &&
							listaTorneos.length > 0 &&
							<>
								<div className="col my-3">
									<h3>Fechas</h3>
									<div className="btn-group d-flex justify-content-cente">
										{
											jsonListaFechas.current !== null
												?
												jsonListaFechas.current.length > 0 &&
												jsonListaFechas.current.map((fecha, index) => {
													return (
														<button
															key={index}
															type="button"
															onClick={((e) => handleCambioFecha(Number(e.currentTarget.dataset.idfecha)))}
															className={`btn btn-sm ${(fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0) === idFecha ? "btn-primary" : "btn-outline-primary"}`}
															data-idfecha={fecha.FechaZona ? fecha.FechaZona[0].IdFecha : 0}>
															{fecha.FechaNumero}
														</button>
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
								<div className="tablaList">
									{
										listaPartidosRender !== null
											?
											listaPartidosRender.length > 0
												?
												<Tabla
													datos={listaPartidosRender}
													titulos={titulos}
													classNames={classNames}
													keyField={"0"}
													tipoCampo={tipoCampo}
													paginadoParam={1000}
													verPaginador={false}
												/>
												:
												<div className="card shadow-sm">
													<div className="card-body text-center py-5">
														<h5 className="fw-bold">
															No se han generado los partidos.
														</h5>
													</div>
												</div>
											:
											<table className='table placeholder-glow'>
												<thead>
													<tr>
														<th className="text-center"><span>#</span></th>
														<th className=""><span>Fecha</span></th>
														<th className=""><span>Local</span></th>
														<th className=""><span>Visitante</span></th>
														<th className=""><span>Sede</span></th>
														<th className="text-center"><span>PDF</span></th>
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
								</div>
							</>
						}
					</div>
				</div>
			</section>
		</>
	)
}


export default FechaImprimir;