import { useState, useEffect, useRef } from 'react'
import { useLocation } from "react-router-dom";
import QuickHelp from '../../components/QuickHelp';

import { useBootstrapModal } from '../../hooks/useBootstrapModal';

import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { SelectType } from '../../types/SelectType';

import { CuerpoTecnicoView } from '../../views/config/CuerpoTecnicoView';

import { getCategoriaListService, getEquipoSelectXCategoriaService } from '../../services/SelectService';
import { getCuerpoTecnicoListService } from '../../services/config/CuerpoTecnicoService';

import { CuerpoTecnicoModal } from './modals/CuerpoTecnicoModal';

import { URL_IMAGEN_TECNICO, URL_IMAGES } from '../../utils/constants';


const CuerpoTecnico = () => {


	const location = useLocation();
	const modalDatos = useBootstrapModal();


	const titulos = { "Id": "#", "Apellido": "Apellido", "Nombre": "Nombre", "Email": "Email" };
	const classNames = { "Id": "text-center" };
	const tipoCampo = { 'Apellido': 'com_Imagen:Apellido' };
	const botones = ["Edit", "Imagen"];


	const [listaCategorias, setListaCategorias] = useState<SelectType[]>([]);
	const [idCategoria, setIdCategoria] = useState<number | null>(null);
	const [listaEquipos, setListaEquipos] = useState<SelectType[] | null>(null);
	const [listaCuerpoTecnico, setListaCuerpoTecnico] = useState<CuerpoTecnicoView[] | null>(null);
	const [id, setId] = useState<number | null>(0);
	const [idEquipo, setIdEquipo] = useState<number | null>(null);
	let { idEquipoActual, idCategoriaActual } = location.state || {};

	// Se usa para que pierda el parámetro si el usuario sigue navegando la página.
	const leerParametros = useRef<boolean>(true);


	const onEdit = (id: number | null) => {
		setId(id)
		modalDatos.open();
	};


	const fetchCategorias = async () => {
		getCategoriaListService()
			.then((categoriaList) => {
				if (categoriaList.length > 0) {
					if (leerParametros.current) {
						setIdCategoria(Number(idCategoriaActual));
					} else {
						setIdCategoria(categoriaList[0].Id);
					}
				} else {
					setListaEquipos([]);
					setListaCuerpoTecnico([]);
				}
				setListaCategorias(categoriaList);
			})
	};

	useEffect(() => {
		fetchCategorias();
	}, [])


	const fetchEquipos = () => {
		if (idCategoria) {
			setIdEquipo(null);
			setListaCuerpoTecnico(null);
			getEquipoSelectXCategoriaService(idCategoria)
				.then((equipoList) => {
					if (equipoList.length > 0) {
						if (leerParametros.current) {
							setIdEquipo(Number(idEquipoActual));
							leerParametros.current = false;
						} else {
							setIdEquipo(equipoList[0].Id);
						}
					}
					setListaEquipos(equipoList);
				})
		}
	};

	useEffect(() => {
		fetchEquipos();
	}, [idCategoria])


	const fetchCuerpoTecnico = () => {
		if (idEquipo) {
			getCuerpoTecnicoListService(idEquipo)
				.then((cuerpoTecnicoList) => {
					const listaConImg = cuerpoTecnicoList.map(ct => ({
						...ct,
						Imagen: ct.Imagen === "" ? URL_IMAGES + 'svg/j0.svg' : URL_IMAGEN_TECNICO + ct.Imagen
					}));
					setListaCuerpoTecnico(listaConImg);
				})
		}
	};


	useEffect(() => {
		setListaCuerpoTecnico(null);
		fetchCuerpoTecnico();
	}, [idEquipo]);


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="jugadores" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Técnicos</h4>
							</div>
							<div className="d-flex flex-row-reverse bd-highlight col-4">
								{
									listaEquipos && listaEquipos.length > 0 &&
									<button
										type="button"
										onClick={() => onEdit(null)}
										className="btn btn-primary m-1 btn-sm">Agregar</button>
								}
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row">
							<div className="col-md-6">
								{
									listaCategorias ?
										listaCategorias.length > 0 &&
										<div className="card-body">
											<label htmlFor="IdCategoria">Categoría</label>
											<QuickHelp helpText="Se muestran los equipos pertenecientes a la categoría seleccionada que contenga un mínimo de 4 equipos." />
											<select
												className="form-select form-select-sm"
												onChange={(e) => { setIdCategoria(Number(e.target.value)); }}
												value={idCategoria || 0}
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
									listaCategorias && listaCategorias.length > 0 && listaEquipos && listaEquipos.length > 0 && idEquipo &&
									<div className="card-body">
										<label htmlFor="IdEquipo">Equipo</label>
										<select
											className="form-select form-select-sm"
											onChange={(e) => {
												setIdEquipo(Number(e.target.value));
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
								listaCategorias && listaCategorias.length > 0
									?
									listaEquipos && listaEquipos.length > 0
										?
										listaCuerpoTecnico
											?
											listaCuerpoTecnico.length > 0
												?
												<Tabla
													datos={listaCuerpoTecnico}
													titulos={titulos}
													botones={botones}
													classNames={classNames}
													keyField="Id"
													onEdit={onEdit}
													tipoCampo={tipoCampo}
												/>
												:
												<div className="card shadow-sm">
													<div className="card-body text-center py-5">
														<h5 className="fw-bold">No hay técnicos cargados, para agregar haga clic en el botón Agregar.</h5>
													</div>
												</div>
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
										:
										<div className="card shadow-sm">
											<div className="card-body text-center py-5">
												<h5 className="fw-bold">
													No hay equipos cargados, vaya al menú Equipos para agregar.
												</h5>
											</div>
										</div>
									:
									<div className="card shadow-sm">
										<div className="card-body text-center py-5">
											<h5 className="fw-bold">Aún no se han cargado categorías en este campeonato, debe ir al menú Config - Categorías para agregar.</h5>
										</div>
									</div>
							}
						</div>
					</div>
				</div>
			</section>
			< CuerpoTecnicoModal
				id={id || null}
				idEquipo={idEquipo || 0}
				fetchCuerpoTecnico={fetchCuerpoTecnico}
				close={modalDatos.close}
				isOpen={modalDatos.isOpen}
				modalRef={modalDatos.ref}
			/>
		</>
	)


}


export default CuerpoTecnico

