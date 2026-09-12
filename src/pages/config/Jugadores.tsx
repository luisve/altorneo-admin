import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify';
import QuickHelp from '../../components/QuickHelp';


import { Loading } from '../../components/Loading';
import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { SelectType } from '../../types/SelectType';
import { EquipoJugadorListView } from '../../views/config/EquipoJugadorListView';
import { Fila } from '../../types/TypesType';
import { ApiResponseArray } from '../../types/ApiResponseType';


import { getCategoriaListService, getEquipoSelectXCategoriaService } from '../../services/SelectService';
import { getJugadoresXEquipoService, postJugadorXLSService } from '../../services/config/JugadorService';


import { URL_IMAGEN_JUGADOR, URL_IMAGES } from '../../utils/constants';


import { JugadorModal } from './modals/JugadorModal';
import { JugadorXLSModal } from './modals/JugadorXLSModal';
import { useBootstrapModal } from '../../hooks/useBootstrapModal';


export const Jugadores = () => {


	const [contadorLoading, setContadorLoading] = useState(0);
	const modalDatos = useBootstrapModal();
	const modalXLS = useBootstrapModal()


	const titulos = { "Id": "#", "Apellido": "Apellido", "Nombre": "Nombre", "Puesto": "Puesto", "Numero": "Numero" };
	const classNames = { "Id": "text-center", "Imagen": "text-center" };
	const tipoCampo = { 'Apellido': 'com_Imagen:Apellido' };
	const botones = ["Edit", "Imagen"];


	const [listaCategorias, setListaCategorias] = useState<SelectType[]>([]);
	const [idCategoria, setIdCategoria] = useState<number>(0);
	const [listaEquipos, setListaEquipos] = useState<SelectType[]>([]);
	const [listaJugadores, setListaJugadores] = useState<EquipoJugadorListView[] | null>(null);
	const [id, setId] = useState<number | null>(0);
	const [idEquipo, setIdEquipo] = useState<number | null>(null);


	const [dataXLS, setDataXLS] = useState<Fila[] | null>(null);


	const onEdit = (Id: number | null) => {
		setId(Id)
		modalDatos.open();
	};


	const fetchCategorias = async () => {
		const categoriaList = await getCategoriaListService();
		setListaCategorias(categoriaList);
		if (categoriaList.length > 0) {
			setIdCategoria(categoriaList[0].Id);
		} else {
			setListaEquipos([]);
			setListaJugadores([]);
		}
	};

	useEffect(() => {
		fetchCategorias();
	}, [])


	const fetchEquipos = useCallback(async () => {
		if (idCategoria > 0) {
			const equipoList = await getEquipoSelectXCategoriaService(idCategoria);
			if (equipoList.length > 0) {
				setIdEquipo(equipoList[0].Id);
			} else {
				setIdEquipo(0);
				setListaJugadores([]);
			}
			setListaEquipos(equipoList);
		}
	}, [idCategoria]);

	useEffect(() => {
		fetchEquipos();
	}, [idCategoria, fetchEquipos])


	const fetchJugadores = async () => {
		if (idEquipo) {
			getJugadoresXEquipoService(idEquipo)
				.then((jugadorList) => {
					jugadorList = jugadorList.map((jugador: EquipoJugadorListView) => ({
						...jugador,
						Imagen: (jugador.Imagen === "" || jugador.Imagen === null) ? URL_IMAGES + 'svg/j0.svg' : URL_IMAGEN_JUGADOR + jugador.Imagen,
					}))
					setListaJugadores(jugadorList);
				})
				.finally(() => { });
		}
	};

	useEffect(() => {
		fetchJugadores();
	}, [idEquipo]);


	const handleChangeXls = async (e: any) => {
		const formData = new FormData();
		formData.append("PlanillaXLS", e.target.files[0], e.target.files[0].name);
		formData.append("IdEquipo", "0");
		setContadorLoading(1);
		const resp: ApiResponseArray<Fila> = await postJugadorXLSService(formData);
		if (resp.code === 200) {
			if (resp.data && resp.data.length > 0) {
				setDataXLS(resp.data);
				modalXLS.open();
			}
			if (resp.msg !== "") {
				toast.warning(resp.msg, { autoClose: 3000, });
			}
		} else {
			toast.error(resp.msg, { autoClose: 3000, });
		}
		setContadorLoading(-1);
	}


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="jugadores" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Jugadores cargados</h4>
							</div>
							<div className="d-flex flex-row-reverse bd-highlight col-4">
								{
									listaEquipos.length > 0 &&
									<button
										type="button"
										onClick={() => onEdit(0)}
										className="btn btn-primary m-1 btn-sm">Agregar</button>
								}
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row">
							<div className="col-md-6">
								{
									listaCategorias !== null ?
										listaCategorias.length > 0 &&
										<div className="card-body">
											<label htmlFor="IdCategoria">Categoría</label>
											<QuickHelp helpText="Se muestran los equipos pertenecientes a la categoría seleccionada que contenga un mínimo de 4 equipos." />
											<select
												className="form-select form-select-sm"
												onChange={(e) => {
													setIdCategoria(Number(e.target.value));
													setListaJugadores(null);
												}}
												value={idCategoria}
												id="IdCategoria"
												name="IdCategoria"
												aria-label='Listado de Categoríias'>
												{
													listaCategorias.map((categoria, index) => {
														return (
															<option value={categoria.Id} key={index} >{categoria.Label}</option>
														)
													})
												}
											</select>
										</div>
										:
										<div className="row g-0 text-center placeholder-glow mt-1">
											<div className="col-4 col-md-4 border py-3 placeholder"></div>
										</div>
								}
							</div>
							<div className="col-md-6">
								{
									listaCategorias !== null && listaCategorias.length > 0 && listaEquipos !== null && listaEquipos.length > 0 && idEquipo &&
									<div className="card-body">
										<label htmlFor="IdEquipo" >Equipo</label>
										<select
											className="form-select form-select-sm"
											onChange={(e) => {
												setIdEquipo(Number(e.target.value));
												setListaJugadores(null);
											}}
											value={idEquipo}
											id="IdEquipo"
											name="IdEquipo"
											aria-label='Listado de equipos'>
											{
												listaEquipos.map((equipo, index) => {
													return (
														<option value={equipo.Id} key={index} >{equipo.Label}</option>
													)
												})
											}
										</select>
									</div>
								}
							</div>
							<div className="col-md-6 d-none">
								<div className="card-body box-xls invisible">
									<label htmlFor="PlanillaXLS" className="col-md-4 control-label">Subir listado XLS</label>
									<div className="form-group">
										<input
											type="file"
											className="form-control form-control-xls"
											name="PlanillaXLS"
											accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
											id="PlanillaXLS" />
									</div>
								</div>
							</div>
						</div>
						<div className="tablaList">
							{
								listaJugadores !== null ?
									(
										listaJugadores.length > 0
											?
											<Tabla
												datos={listaJugadores}
												titulos={titulos}
												botones={botones}
												classNames={classNames}
												keyField="Id"
												onEdit={onEdit}
												tipoCampo={tipoCampo}
											/>
											:
											listaEquipos.length > 0
												?
												<>
													<div className="card shadow-sm">
														<div className="card-body text-center py-5">
															<h5 className="fw-bold">No hay jugadores cargados, para agregar haga clic en el botón Agregar.</h5>
														</div>
													</div>
													<br />
													<div className="row justify-content-md-center">
														<div className="col col-lg-8">
															<div className="card shadow">
																<div className="card-header">
																	Subir Planilla de Cálculo
																</div>
																<div className="card-body text-center">
																	<h5 className="fw-bold">
																		También tiene la opción de subir un archivo tipo XLS con los datos de los jugadores y hacer una carga masiva.																Para hacerlo de esta manera haga clic en el botón Seleccionar Archivo
																	</h5>
																	<div className="row">
																		<div className="mb-3">
																			<div className="row justify-content-center">
																				<div className="col-12 col-md-8">
																					<input
																						onChange={(e) => handleChangeXls(e)}
																						className="form-control"
																						type="file"
																						accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .ods"
																						id="formFile" />
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</>
												:
												<div className="card shadow-sm">
													<div className="card-body text-center py-5">
														<h5 className="fw-bold">
															No hay equipos cargados, vaya al menú Equipos para agregar.
														</h5>
													</div>
												</div>
									)
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
						</div>
					</div>
				</div>
			</section>
			<Loading contador={contadorLoading} />
			<JugadorModal
				id={id}
				fetchJugadores={fetchJugadores}
				idEquipo={idEquipo ?? 0}
				isOpen={modalDatos.isOpen}
				close={modalDatos.close}
				modalRef={modalDatos.ref}
			/>
			<JugadorXLSModal
				xls={dataXLS}
				idEquipo={idEquipo ?? 0}
				fetchJugadores={fetchJugadores}
				close={modalXLS.close}
				modalRef={modalXLS.ref}
			/>
		</>
	)
}

export default Jugadores;