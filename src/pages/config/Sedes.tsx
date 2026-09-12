import { useState, useEffect } from 'react'


import { URLROOT, URL_IMAGES } from '../../utils/constants';
import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';
import { Loading } from '../../components/Loading';


import { SedeType } from '../../types/config/SedeType';
import { SelectType } from '../../types/SelectType';


import { getSedesListService } from '../../services/config/SedesService';
import { getPaisSelectService } from '../../services/SelectService';


import { useBootstrapModal } from '../../hooks/useBootstrapModal';


import { SedeModal } from './modals/SedeModal';


export const Sedes = () => {


	const [contadorLoading, setContadorLoading] = useState(0);
	const modalDatos = useBootstrapModal();


	const titulos = { "Id": "#", "Nombre": "Nombre", "Domicilio": "Domicilio", "Imagen": "Imagen" };
	const classNames = { "Id": "text-center", "Imagen": "text-center" };
	const tipoCampo = { "Imagen": "img" };
	const botones = ["Edit", "Imagen"];


	const [listaSedes, setListaSedes] = useState<SedeType[] | null>(null);
	const [listaPaises, setListaPaises] = useState<SelectType[]>([]);
	const [id, setId] = useState<number | null>(null);


	const onEdit = (id: number | null) => {
		setId(id)
		modalDatos.open();
	};


	const fetchSedes = async () => {
		const sedeList = await getSedesListService();
		sedeList.forEach(s => {
			s.Imagen = s.NombreImagen ? URLROOT + s.NombreImagen : URL_IMAGES + 'svg/sede.svg';
		});
		setListaSedes(sedeList);
	};


	const fetchPaisList = async () => {
		const paisList = await getPaisSelectService();
		setListaPaises(paisList);
	};


	useEffect(() => {
		setContadorLoading(1);
		fetchSedes();
		fetchPaisList();
		setContadorLoading(-1);
	}, []);



	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="sedes" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Sedes cargadas</h4>
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
							listaSedes !== null
								?
								listaSedes.length > 0
									?
									<Tabla
										datos={listaSedes}
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
												No hay datos cargados, haga clic en el botón Agregar para ingresar la primera sede.
											</h5>
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
			<Loading contador={contadorLoading} />
			<SedeModal
				id={id}
				listaPaises={listaPaises}
				fetchSedes={fetchSedes}
				isOpen={modalDatos.isOpen}
				close={modalDatos.close}
				modalRef={modalDatos.ref}
			/>
		</>
	)
}


export default Sedes;