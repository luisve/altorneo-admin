import { useState, SyntheticEvent, ChangeEvent, useEffect, useRef, useCallback } from 'react'



interface Props {
	datos: any[],
	titulos: any,
	botones?: string[];
	classNames?: any;
	onEdit?: any;
	keyField?: string;
	tipoCampo?: any;
	onCheck?: any;
	onClick?: any;
	filtros?: any;
	ordenCampos?: any;
	paginadoParam?: number;
	verPaginador?: boolean;
	trCSS?: string[];
	onClicCash?: any;
}


interface Filtros {
	campo: string;
	tipo: string;
	valor: string;
}


export const Tabla = ({
	datos,
	titulos,
	botones = [],
	classNames,
	onEdit = null,
	keyField = "",
	tipoCampo = [],
	onCheck = null,
	onClick = null,
	filtros = null,
	ordenCampos = [],
	paginadoParam = 10,
	verPaginador = true,
	trCSS = [],
	onClicCash = null }: Props) => {


	const [paginado, setPaginado] = useState(paginadoParam);
	const inicio = useRef(0);
	const [pagina, setPagina] = useState(1);

	const campos = Object.keys(titulos)

	/** DatosPrint, datos a imprimir, se guarda el original Datos por si se filtran
	 * o sufren algún otro proceso*/
	const [datosPrint, setDatosPrint] = useState(datos);
	/** Valores de los filtros */
	const [filtrosJS, setFiltroJS] = useState<Filtros[]>([]);
	/** Para indicar si se muestran los filtros o no */
	const [conFiltro, setConFiltro] = useState<boolean>(false);


	const [campoOrden, setCampoOrden] = useState("");


	const registrosListados = useRef(0);


	const filtrar = useCallback(() => {
		if (filtrosJS.length > 0) {
			let datosPrintTemp = datos;
			filtrosJS.forEach(filtro => {
				if ((filtro.tipo === "texto") && (filtro.valor !== "")) {
					datosPrintTemp = datosPrintTemp.filter(registro => ((registro[filtro.campo]).toLowerCase()).match(filtro.valor.toLowerCase()) !== null);
				}
				if ((filtro.tipo === "select") && (filtro.valor !== "")) {
					datosPrintTemp = datosPrintTemp.filter(registro => registro[filtro.campo] === filtro.valor);
				}
			});
			setPagina(1);
			inicio.current = 0;
			setDatosPrint(datosPrintTemp);
		}
	}, [datos, filtrosJS]);


	useEffect(() => {
		setDatosPrint(datos);
		if ((filtros !== null) && (filtrosJS.length === 0)) {
			let filtrosJSTemp: Filtros[] = [];
			for (let filtro in filtros) {
				filtrosJSTemp.push({ campo: filtro, tipo: filtros[filtro], valor: "" });
			}
			setFiltroJS(filtrosJSTemp);
		} else {
			filtrar();
		}

	}, [datos, filtros, filtrar, filtrosJS]);


	const handleImageLoaded = (img: HTMLInputElement) => {
		const loading = document.getElementById(img.id + "_loading");
		if (loading) { loading.classList.add('d-none'); }
		const imagen = document.getElementById(img.id);
		if (imagen) { imagen.classList.remove('d-none'); }
	};


	const handleClicCash = (el: HTMLInputElement) => {
		onClicCash(Number(el.dataset.id));
	};


	const handleClicEdit = (el: HTMLInputElement) => {
		onEdit(Number(el.dataset.id));
	};


	/** Cambia el paginado de la tabla */
	const paginatorSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		// setInicio(0);
		inicio.current = 0;
		setPagina(1);
		setPaginado(Number(event.target.value));
	};


	/** Cambia de página */
	const paginatorChangeInicio = (valor: number) => {
		if ((inicio.current + (paginado * valor)) >= 0 && (inicio.current + (paginado * valor)) < datosPrint.length) {
			setPagina(pagina + valor);
			// setInicio(inicio + (paginado * valor));
			inicio.current = inicio.current + (paginado * valor);
		}
	}


	/** Establece un filtro por comparación de texto */
	const handleChangeFiltro = (el: HTMLInputElement) => {
		let campo = el.dataset.campo || "";
		let valor = el.value;
		let filtrosJSTemp = filtrosJS;
		filtrosJSTemp.map(filtro => {
			filtro.valor = filtro.campo === campo ? valor : filtro.valor;
			return filtro;
		});
		setFiltroJS(filtrosJSTemp);
		filtrar();
	}


	/** Establece un filtro por select */
	const handleOnSelect = (el: HTMLSelectElement) => {
		let filtrosJSTemp = filtrosJS;
		let campo = el.dataset.campo || "";
		let valor = el.value;
		filtrosJSTemp.map(filtro => {
			filtro.valor = (filtro.campo === campo) ? ((el.selectedIndex !== 0) ? valor : "") : filtro.valor;
			return filtro;
		});
		setFiltroJS(filtrosJSTemp);
		filtrar();
	}


	/** Rutina para ordenar los datos */
	useEffect(() => {
		if (campoOrden !== "") {
			filtrar();
			let orden = ordenCampos.filter((reg: any) => reg.campo === campoOrden)[0];
			let datosTemp = datosPrint;
			datosTemp.forEach((dato, idx) => {
				datosTemp.forEach((dato2, idx2) => {
					if (idx2 > idx) {
						if (orden.datos.tipo === "string") {
							if ((dato[campoOrden]).localeCompare(dato2[campoOrden]) === orden.datos.orden) {
								//if ((dato[campoOrden]).localeCompare(dato2[campoOrden]) < 0) {
								let temp = dato2;
								datosTemp[idx2] = dato;
								datosTemp[idx] = temp;
								dato = temp;
							}
						}
						if (orden.datos.tipo === "number") {
							if (
								((Number(dato[campoOrden]) - Number(dato2[campoOrden])) > 0 && orden.datos.orden > 0)
								||
								((Number(dato[campoOrden]) - Number(dato2[campoOrden])) < 0 && orden.datos.orden < 0)
							) {
								let temp = dato2;
								datosTemp[idx2] = dato;
								datosTemp[idx] = temp;
								dato = temp;
							}
						}
					}
				})
			});
			orden.datos.orden = orden.datos.orden === 1 ? -1 : 1;
			inicio.current = 0;
			setPagina(1);
			setDatosPrint(datosTemp);
			setCampoOrden("");
		}
	}, [campoOrden, datosPrint, filtrar, ordenCampos])


	registrosListados.current = 0;


	return (
		<>
			<table className='table table-hover text-nowrap table-striped'>
				<thead>
					<tr>
						{
							campos.map((campo: string, indexTH: number) => {
								let css = "";
								if (classNames !== undefined) {
									if (classNames[campo] !== undefined) {
										css = classNames[campo];
									}
								}
								let listaOptions: string[] = [];
								if (filtros !== null) {
									if (filtros[campo] === "select") {
										datos.forEach(dato => {
											if (listaOptions.indexOf(dato[campo]) < 0) {
												listaOptions.push(dato[campo]);
											}
										});
										listaOptions = listaOptions.sort();
									}
								}
								let orden = ordenCampos.filter((reg: any) => reg.campo === campo)[0] || null;

								return (
									<th key={indexTH} className={css}>
										{
											((filtros !== null) && (indexTH === 0)) &&
											<span
												onClick={() => { setConFiltro(!conFiltro) }}
												title='Filtros'
												className="material-icons ico-filtro text-primary">
												{conFiltro ? "filter_alt_off" : "filter_alt"}
											</span>
										}
										{
											(filtros !== null && filtros[campo]) === "texto" &&
											<>
												<div className={conFiltro ? "" : "d-none"}>
													<input
														className='rounded border-1 border-info form-control form-control-sm'
														type="text"
														data-campo={campo}
														onChange={(e) => handleChangeFiltro(e.target)}
													/>
												</div>
											</>
										}
										{
											(filtros !== null && filtros[campo] === "select") &&
											<>
												<div className={conFiltro ? "" : "d-none"}>
													<select onChange={(s) => handleOnSelect(s.target)}
														className='rounded border-1 border-info form-select form-select-sm'
														data-campo={campo}>
														<option key={-1}>Seleccionar</option>
														{listaOptions.map((option, index) => {
															return (
																<option key={index}>{option}</option>
															)
														})}
													</select>
												</div>
											</>
										}
										{
											/** Se imprime el ícono de orden */
											orden !== null &&
											<span
												onClickCapture={() => setCampoOrden(campo)}
												role='button'
												className="ico-sort material-icons text-primary">
												{orden.datos.tipo === "string" ? "sort_by_alpha" : "sort"}
											</span>
										}
										{
											/** Se imprime el título */
											<span>{titulos[campo]}</span>
										}
									</th>
								)
							})
						}
						{(botones.length > 0) && <th key={0}></th>}
					</tr>
				</thead>
				<tbody>
					{
						datosPrint.map((registro: any, indexTR: number) => {
							if ((indexTR >= inicio.current) && (indexTR < (inicio.current + paginado))) {
								registrosListados.current = registrosListados.current + 1;
								return (
									<tr key={indexTR} className={trCSS[indexTR]}>
										{
											campos.map((campo, indexTD) => {
												let css = "";
												if (classNames !== undefined) {
													if (classNames[campo] !== undefined) {
														css = classNames[campo];
													}
												}
												if (tipoCampo[campo] === "pdf") {
													return (
														<td key={indexTD} className={css}>
															<a href={registro[campo]}
																target="_blank" rel="noopener noreferrer">
																<i className="fa fa-file-pdf"></i>
															</a>
														</td>
													)
												}
												if (tipoCampo[campo] === "img") {
													return (
														<td key={indexTD} className={css}>
															{
																registro[campo] !== "" ?
																	<>
																		<div
																			id={"img_" + indexTR + "_" + indexTD + "_loading"}
																			className='img'>
																		</div>
																		<img
																			onLoad={(e: SyntheticEvent) => handleImageLoaded(e.target as HTMLInputElement)}
																			data-index={indexTR}
																			id={"img_" + indexTR + "_" + indexTD}
																			data-id={"img_" + indexTR + "_" + indexTD}
																			src={registro[campo]}
																			alt="Imagen" />
																	</>
																	:
																	""
															}
														</td>
													)
												}
												if (tipoCampo[campo] === "checkBox") {
													return (
														<td key={indexTD} className={css}>
															<div className="form-check form-switch">
																<input
																	className="form-check-input checkEquipo mx-auto"
																	checked={Number(registro[campo]) > 0}
																	onChange={(e) => onCheck(e)}
																	type="checkbox"
																	data-id={registro[keyField]}
																	data-index={indexTD}
																	id={"ch_" + registro[keyField]} />
															</div>
														</td>
													)
												}
												if (tipoCampo[campo] === "btn") {
													return (
														<td key={indexTD} className={css}>
															<button
																type="button"
																className="btn btn-primary btn-sm"
																onClick={(e) => onClick(e)}
																data-index={indexTD}
																data-id={registro[keyField]}>
																Jugadores
															</button>
														</td>
													)
												}
												if (('' + tipoCampo[campo]).slice(0, 3) === "com") {
													// campo combinado imagen y texto
													const [img, txt] = (tipoCampo[campo]).slice(4).split(":");
													return (
														<td key={indexTD} className={css}>
															<img
																style={{ left: "5px" }}
																src={registro[img]}
																alt={registro[txt]} />
															<span className='com-img-txt'>
																{registro[txt]}
															</span>
														</td>
													)
												}
												return (
													<td key={indexTD} className={css}>{registro[campo]}</td>
												)
											})
										}
										{
											(botones.length > 0) &&
											<td className='text-center table-td-botones' key={campos.length + 1}>
												{
													botones.map((b: string, indexBotones: number) => {
														if (b === "Edit") {
															return (
																<i
																	key={indexBotones}
																	onClick={(e) => handleClicEdit(e.currentTarget as HTMLInputElement)}
																	role='button'
																	className="fa fa-edit"
																	data-id={registro[keyField]}></i>
															);
														} else if (b === "Cash") {
															{
																/*
															<i class="fa-solid fa-money-bill"></i>
															return (
																<span
																	key={indexBotones}
																	onClick={(e) => handleClicCash(e.currentTarget as HTMLInputElement)}
																	role='button'
																	className="material-icons-outlined link-edit"
																	data-id={registro[keyField]}>
																	local_atm
																</span>
															);
															*/
															}
															return (
																<i
																	key={indexBotones}
																	onClick={(e) => handleClicCash(e.currentTarget as HTMLInputElement)}
																	role='button'
																	className="fa fa-money-bill"
																	data-id={registro[keyField]}></i>
															);
														} else {
															return null;
														}
													})
												}
											</td>
										}
									</tr>
								)
							} else {
								return null;
							}
						})
					}
				</tbody>
			</table>
			{
				verPaginador &&
				<div className="clearfix text-end d-flex flex-column align-items-end">
					<span>
						{registrosListados.current} Registros de: {datosPrint.length}
					</span>
					<nav aria-label="Page Navigator">
						<ul className="pagination">
							<li
								className="page-item"
								onClick={() => paginatorChangeInicio(-1)}>
								<a className="page-link" href="#" aria-label="Previous">
									<span aria-hidden="true">&laquo;</span>
								</a>
							</li>
							<li className="page-item">
								<a className="page-link" href="#" aria-label="Rows">
									<select
										onChange={paginatorSelectChange}
										className="form-select"
										name='paginador'>
										<option value={10}>10</option>
										<option value={100}>100</option>
										<option value={1000}>1000</option>
									</select>
								</a>
							</li>
							<li
								className="page-item"
								onClick={() => paginatorChangeInicio(1)}>
								<a className="page-link" href="#" aria-label="Next">
									<span aria-hidden="true">&raquo;</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			}

			{
				/*
				verPaginador &&
				<div className="clearfix text-end">
					{registrosListados.current} Registros de: {datosPrint.length}
					<span style={{ width: '80px', marginRight: '20px', display: 'inline-flex' }}>Pag: {pagina}</span>
					<ul className="pagination pagination-sm m-0 float-end">
						<li
							role='button'
							className="page-item page-link"
							onClick={() => paginatorChangeInicio(-1)}>
							&laquo;
						</li>
						<li className="page-item" >
							<select className="page-link mx-1" onChange={paginatorSelectChange}>
								<option value="10">10</option>
								<option value="100" >100</option>
								<option value="1000" >1000</option>
							</select>
						</li>
						<li
							role='button'
							className="page-item page-link"
							onClick={() => paginatorChangeInicio(1)}>
							&raquo;
						</li>
					</ul>
				</div>
				*/
			}
		</>
	)
}
