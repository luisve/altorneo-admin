import { useState, useEffect } from 'react';


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';
import { TorneoAltaModal } from './modals/TorneoAltaModal';


import { TorneoView } from '../../views/torneo/TorneoView';
import { SelectType } from '../../types/SelectType';


import { getCategoriaConEquiposSelectService } from '../../services/SelectService';
import { getTorneoListService } from '../../services/torneo/TorneoAltaService';
import { useBootstrapModal } from '../../hooks/useBootstrapModal';


export const TorneoAlta = () => {

	const modalDatos = useBootstrapModal();


	const titulos = { "Id": "#", "Nombre": "Nombre", "FechaInicio": "Fecha Inicio", "Categoria": "Categoría" };
	const classNames = { "Id": "text-center" };
	const tipoCampo = {};
	const botones = ["Edit"];


	const [listaTorneos, setListaTorneos] = useState<TorneoView[] | null>(null);
	const [listaCategorias, setListaCategorias] = useState<SelectType[] | null>(null);
	const [id, setId] = useState<number | null>(null);


	const onEdit = (id: number | null) => {
		setId(id)
		modalDatos.open();
	};


	const fetchCategorias = async () => {
		// La categoria se descarga solo para después pasar el dato al modal
		// const categoriaList = await getCategoriaListService();
		const categoriaList = await getCategoriaConEquiposSelectService();
		setListaCategorias(categoriaList);
	};


	const fetchTorneos = async () => {
		const torneoList = await getTorneoListService();
		setListaTorneos(torneoList);
	};


	useEffect(() => {
		fetchCategorias();
		fetchTorneos();
	}, [])


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="torneo alta" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Torneos no iniciados</h4>
							</div>
							<div className="d-flex flex-row-reverse bd-highlight col-4">
								<button
									type="button"
									onClick={() => onEdit(null)}
									disabled={listaCategorias === null || listaCategorias.length === 0}
									className="btn btn-primary m-1 btn-sm">Agregar</button>
							</div>
						</div>
					</div>
					<div className="container">
						{
							listaCategorias &&
							listaCategorias.length === 0 &&
							<div className="alert alert-info" role="alert">
								No hay Categorías creadas o no hay categorías que contengan 4 equipos o mas, los necesarios para crear un torneo.
							</div>
						}
						<div className="tablaList">
							{
								listaTorneos !== null
									?
									(
										listaTorneos.length > 0
											?
											<Tabla
												datos={listaTorneos}
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
													<h5 className="fw-bold">
														No hay torneos cargados, para agregar el primero debes hacer clic en el botón Agregar.
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
												<th className=""><span>Fecha Inicio</span></th>
												<th className=""><span>Categoría</span></th>
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
				</div>
			</section>
			{
				<TorneoAltaModal
					id={id}
					listaCategorias={listaCategorias ?? []}
					fetchTorneos={fetchTorneos}
					close={modalDatos.close}
					modalRef={modalDatos.ref}
				/>
			}
		</>
	)
}


export default TorneoAlta;