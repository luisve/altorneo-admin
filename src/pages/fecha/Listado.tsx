import { useEffect, useRef, useState } from "react";

import { Breadcrumb } from "../../components/Breadcrumb"
import { Menu } from "../../components/Menu"
import ExportExcel, { Titulos } from "../../components/ExportExcel";
import { ImprimirPDF, Column, PDFTitulos } from "../../components/ExportarPDFs";


import { DefaultFechaListadoType, FechaListadoType } from "../../types/fecha/FechaListadoType";

import { getHoy, toDayMonthYear, toNombreArchivo } from "../../utils/formatDate";

import { FechaListadoView } from "../../views/Fecha/FechaListadoView";

import { getListadoService } from "../../services/fecha/FechaService";
import { getTorneoDatosTitulosService } from "../../services/torneo/TorneoService";


const Listado = () => {


	const [form, setForm] = useState<FechaListadoType>(DefaultFechaListadoType);
	const [listado, setListado] = useState<FechaListadoView[] | null>(null);
	const [listadoFiltrado, setListadoFiltrado] = useState<FechaListadoView[] | null>(null);
	const sedesSeleccionadas = useRef<string[]>([])
	const [sedesOpciones, setSedesOpciones] = useState<string[]>([]);
	const categoriasSeleccionadas = useRef<string[]>([]);
	const [categoriasOpciones, setCategoriasOpciones] = useState<string[]>([]);
	const [imprimiendo, setImprimiendo] = useState(false);
	const datos = useRef<{ campeonato: string; torneo: string; }>({ campeonato: "", torneo: "" });
	const pdfTitulos = useRef<PDFTitulos[]>([]);
	const titulosXLS = useRef<Titulos[]>([]);



	const misTitulos: string[] = ['Hora', 'Sede', 'Categoría', 'Local', 'Visitante'];

	const getListado = () => {
		getListadoService(form.Dia)
			.then((listado) => {
				listado.sort((a, b) => a.Hora.localeCompare(b.Hora));
				setSedesOpciones([...new Set(listado.map(x => x.Sede))]);
				sedesSeleccionadas.current = [...new Set(listado.map(x => x.Sede))];
				setCategoriasOpciones([...new Set(listado.map(x => x.Categoria))]);
				categoriasSeleccionadas.current = [...new Set(listado.map(x => x.Categoria))];
				setListado(listado);
				setListadoFiltrado(listado);
			})
		getTorneoDatosTitulosService()
			.then((data) => {
				datos.current = data;
				pdfTitulos.current = [
					{ texto: data.campeonato, tamano: 14, estilo: "bold", align: "left" },
					{ texto: "Partidos del dia " + toDayMonthYear(form.Dia), estilo: "bold", align: "left" },
				];
				titulosXLS.current = [
					{ texto: data.campeonato },
					{ texto: "Partidos del dia " + toDayMonthYear(form.Dia) }
				];
			})
	}


	const columnasConfig: Column<FechaListadoView>[] = [
		{ key: "Hora", label: "Hora", width: 1.5 },
		{ key: "Sede", label: "Sede", width: 2.5 },
		{ key: "Categoria", label: "Categoría", width: 4 },
		{ key: "Local", label: "Local", width: 4 },
		{ key: "Visitante", label: "Visitante", width: 4 }
	];


	useEffect(() => {
		setForm(prev => ({ ...prev, Dia: getHoy() }));
	}, [])


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="fecha listado" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de partidos de Partidos</h4>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row my-2">
							<div className="col-md-6">
								<div className="row">
									<div className="col-md-4">
										<label htmlFor="Dia" className="col-md-6 control-label">
											<p className="fw-bolder">
												Dia</p></label>
									</div>
									<div className='col-md-8'>
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
							<div className="col-md-6">
								<div className="row">
									<button
										onClick={getListado}
										type="button"
										className="btn btn-primary m-1">Buscar
									</button>
								</div>
								<div className="row justify-content-end">
									{
										listadoFiltrado && listadoFiltrado.length > 0 &&
										<>
											<ExportExcel
												titulos={titulosXLS.current}
												data={listadoFiltrado}
												headers={misTitulos}
												fileName={'Partidos_' + toNombreArchivo(form.Dia)}
												sheetName="Listado" />
											<button
												title="Exportar a PDF"
												className="btn btn-primary m-1"
												onClick={() => {
													setImprimiendo(true);
													setTimeout(() => setImprimiendo(false), 500);
												}}
												disabled={imprimiendo}
												style={{ cursor: imprimiendo ? "not-allowed" : "pointer" }}>
												<i className="fa fa-file-pdf"></i>
											</button>
											{
												imprimiendo &&
												<ImprimirPDF<FechaListadoView>
													data={listadoFiltrado}
													columns={columnasConfig}
													titulos={pdfTitulos.current} />
											}
										</>
									}
								</div>
							</div>
						</div>
						<div className="row my-2">
							<div className="col-md-6">
								{
									sedesOpciones.length > 0 &&
									<div className="row bg-light border rounded p-3 shadow-sm">
										<div className="col-md-4">
											<label htmlFor="Sede" className="col-md-6 control-label">
												<p className="fw-bolder">
													Sede</p></label>
										</div>
										<div className='col-md-8 d-flex flex-column gap-2'>
											{
												sedesOpciones.map(sede => (
													<div className="form-check mb-2" key={sede}>
														<input
															className="form-check-input me-2 cursor-pointer"
															type="checkbox"
															id={`estado-${sede}`}
															checked={sedesSeleccionadas.current.includes(sede)}
															onChange={(e) => {
																if (e.target.checked) {
																	sedesSeleccionadas.current = [...sedesSeleccionadas.current, sede];
																} else {
																	sedesSeleccionadas.current = sedesSeleccionadas.current.filter(x => x !== sede);
																}
																if (listado) {
																	setListadoFiltrado(listado.filter(x => sedesSeleccionadas.current.includes(x.Sede)))
																}
															}}
														/>
														<label
															className="list-group-item list-group-item-action cursor-pointer w-75"
															htmlFor={`estado-${sede}`}>
															{sede}
														</label>
													</div>
												))
											}
										</div>
									</div>
								}
							</div>
							<div className="col-md-6">
								{
									categoriasOpciones.length > 0 &&
									<div className="row bg-light border rounded p-3 shadow-sm">
										<div className="col-md-4">
											<label htmlFor="Categoria" className="col-md-6 control-label">
												<p className="fw-bolder">Categoría</p></label>
										</div>
										<div className='col-md-8 d-flex flex-column gap-2'>
											{
												categoriasOpciones.map(categoria => (
													<div className="form-check mb-2" key={categoria}>
														<input
															className="form-check-input cursor-pointer"
															type="checkbox"
															id={`estado-${categoria}`}
															checked={categoriasSeleccionadas.current.includes(categoria)}
															onChange={(e) => {
																if (e.target.checked) {
																	categoriasSeleccionadas.current = [...categoriasSeleccionadas.current, categoria];
																} else {
																	categoriasSeleccionadas.current = categoriasSeleccionadas.current.filter(x => x !== categoria);
																}
																if (listado) {
																	setListadoFiltrado(listado.filter(x => categoriasSeleccionadas.current.includes(x.Categoria)))
																}
															}}
														/>
														<label
															className="form-check-label cursor-pointer w-75"
															htmlFor={`estado-${categoria}`}>
															{categoria}
														</label>
													</div>
												))}
										</div>
									</div>
								}
							</div>
						</div>
						<div className="row">
							<table className='table table-hover text-nowrap table-striped'>
								<thead>
									<tr>
										<th className="text-center">Hora</th>
										<th>Sede</th>
										<th>Categoría</th>
										<th>Local</th>
										<th>Visitante</th>
									</tr>
								</thead>
								<tbody>
									{
										listadoFiltrado &&
										listadoFiltrado.map((partido, index) => {
											return (
												<tr key={index}>
													<td className="text-center">{partido.Hora}</td>
													<td>{partido.Sede}</td>
													<td>{partido.Categoria}</td>
													<td>{partido.Local}</td>
													<td>{partido.Visitante}</td>
												</tr>
											)
										})
									}
								</tbody>
							</table>
						</div>
					</div>
				</div >
			</section >
		</>
	)
}

export default Listado
