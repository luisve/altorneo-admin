import { useState, useEffect } from 'react';


import { useBootstrapModal } from '../../hooks/useBootstrapModal';


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';
import { Loading } from '../../components/Loading';


import { CategoriaView } from '../../views/config/CategoriaView';


import { getCagetoriaListService } from '../../services/config/CategoriaService';


import { CategoriaModal } from './modals/CategoriaModal';


export const Categorias = () => {


	const [contadorLoading, setContadorLoading] = useState(0);
	const modalDatos = useBootstrapModal();


	const titulos = { "Id": "#", "Nombre": "Nombre" };
	const classNames = { "Id": "text-center" };
	const tipoCampo = {};
	const botones = ["Edit", "Imagen"];


	const [listaCategorias, setListaCategorias] = useState<CategoriaView[] | null>(null);
	const [Id, setId] = useState<number | null>(0);


	const onEdit = (Id: number | null) => {
		setId(Id);
		modalDatos.open();
	};


	const fetchCategorias = async () => {
		const categoriaList = await getCagetoriaListService();
		setListaCategorias(categoriaList);
	};


	useEffect(() => {
		setContadorLoading(1);
		fetchCategorias();
		setContadorLoading(-1);
	}, []);


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="categorias" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Categorías cargadas</h4>
							</div>
							<div className="d-flex flex-row-reverse bd-highlight col-4">
								<button
									type="button"
									onClick={() => onEdit(null)}
									className="btn btn-primary m-1 btn-sm">Agregar</button>
							</div>
						</div>
					</div>
					<div className="tablaList">
						{
							listaCategorias !== null
								? (
									listaCategorias.length > 0 ?
										<Tabla
											datos={listaCategorias}
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
													No hay ninguna categoría cargada, haga clic en el botón agregar para agregar la primera.
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
											<th></th>
										</tr>
									</thead>
									<tbody>
										{
											Array(5).fill(0).map((_, index) => (
												<tr key={index}>
													{
														Array(3).fill(0).map((_, index) => (
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
			<Loading contador={contadorLoading} />
			<CategoriaModal
				id={Id}
				fetchCategorias={fetchCategorias}
				close={modalDatos.close}
				modalRef={modalDatos.ref}
			/>
		</>
	)
}


export default Categorias;