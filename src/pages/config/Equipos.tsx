import { useState, useEffect, useCallback } from 'react'


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';
import { URL_IMAGES, URLROOT } from '../../utils/constants';


import { SelectType } from '../../types/SelectType';
import { EquipoView } from '../../views/config/EquipoView';


import { getEquiposXCategoriaService } from '../../services/config/EquipoService';
import { getCategoriaListService } from '../../services/SelectService';


import { useBootstrapModal } from '../../hooks/useBootstrapModal';


import { EquipoModal } from './modals/EquipoModal';


export const Equipos = () => {


	const modalDatos = useBootstrapModal();


	const titulos = { "Id": "#", "Nombre": "Nombre", "NombreCategoria": "Categoría", "ImagenPerfil": "Imagen" };
	const classNames = { "Id": "text-center", 'ImagenPerfil': 'text-center' };
	const tipoCampo = { "ImagenPerfil": "img", 'Nombre': 'com_ImagenEscudo:Nombre' };
	const botones = ["Edit", "Imagen"];


	const [listaCategorias, setListaCategorias] = useState<SelectType[] | null>(null);
	const [idCategoria, setIdCategoria] = useState<number>(0);
	const [listaEquipos, setListaEquipos] = useState<EquipoView[] | null>(null);
	const [id, setId] = useState<number | null>(null);


	const onEdit = (id: number | null) => {
		setId(id)
		modalDatos.open();
	};


	const fetchCategorias = async () => {
		const categoriaList = await getCategoriaListService();
		setListaCategorias(categoriaList);
		if (categoriaList.length === 0) {
			setListaEquipos([]);
		} else {
			setIdCategoria(categoriaList[0].Id);
		}
	};


	useEffect(() => {
		fetchCategorias();
	}, [])

	const fetchEquipos = useCallback(async () => {
		if (idCategoria > 0) {
			var listaEquipos = await getEquiposXCategoriaService(idCategoria);
			listaEquipos = listaEquipos.map((equipo: EquipoView) => ({
				...equipo,
				ImagenPerfil: (equipo.ImagenPerfil !== "" ? URLROOT + equipo.ImagenPerfil : URL_IMAGES + 'svg/equipo.svg'),
				ImagenEscudo: (equipo.ImagenEscudo !== "" ? URLROOT + equipo.ImagenEscudo : URL_IMAGES + 'svg/escudo.svg'),
			}));
			setListaEquipos(listaEquipos);
		}
	}, [idCategoria]);

	useEffect(() => {
		fetchEquipos();
	}, [idCategoria, fetchEquipos])


	const handleChangeCategoria = (idCategoria: number) => {
		setListaEquipos(null);
		setIdCategoria(idCategoria);
	}


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="equipos" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Equipos cargados</h4>
							</div>
							<div className="d-flex flex-row-reverse bd-highlight col-4">
								{
									listaCategorias !== null &&
									listaCategorias.length > 0 &&
									<button
										type="button"
										onClick={() => onEdit(null)}
										className="btn btn-primary m-1 btn-sm">Agregar</button>
								}
							</div>
						</div>
					</div>
					{
						listaCategorias !== null &&
						listaCategorias.length > 0 &&
						<div className="row">
							<div className="col-md-6">
								<div className="card-body">
									<label htmlFor="IdCategoria">Categoría</label>
									<select
										className="form-select form-select-sm"
										onChange={(e) => { handleChangeCategoria(Number(e.target.value)) }}
										value={idCategoria}
										id="IdCategoria"
										name="IdCategoria"
										aria-label='Listado de equipos'>
										{
											listaCategorias.map((categoria, index) => {
												return (
													<option value={categoria.Id} key={index} >{categoria.Label}</option>
												)
											})
										}
									</select>
								</div>
							</div>
						</div>
					}
					<div className="tablaList">
						{
							listaEquipos !== null ?
								(
									listaEquipos.length > 0
										?
										<Tabla
											datos={listaEquipos}
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
												<h5 className="fw-bold">No hay equipos cargados aún, para agrega el primero haga clic en el botón Agregar. Tenga en cuenta que tienen que estar cargadas las categorías para asignar el equipo.</h5>
											</div>
										</div>
								)
								:
								<table className='table placeholder-glow'>
									<thead>
										<tr>
											<th className="text-center"><span>#</span></th>
											<th className=""><span>Nombre</span></th>
											<th className=""><span>Categoría</span></th>
											<th className="text-center"><span>Imagen</span></th>
											<th></th>
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
					</div>
				</div>
			</section>
			<EquipoModal
				id={id}
				fetchEquipos={fetchEquipos}
				listaCategorias={listaCategorias}
				close={modalDatos.close}
				isOpen={modalDatos.isOpen}
				modalRef={modalDatos.ref}
			/>
		</>
	)
}


export default Equipos;