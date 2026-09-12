import { useState, useEffect } from 'react'


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { JuezModal } from './modals/JuezModal';


import { getJuecesListService } from '../../services/config/JuezService';


import { useBootstrapModal } from '../../hooks/useBootstrapModal';


import { JuezType } from '../../types/config/JuezType';


export const Jueces = () => {

	const modalDatos = useBootstrapModal();

	const titulos = { "Id": "#", "ApellidoYNombre": "Apellido y Nombre", "Mail": "Mail", "Telefono": "Telefono" };
	const classNames = { "Id": "text-center" };
	const tipoCampo = {};
	const botones = ["Edit"];


	const [listaJueces, setListaJueces] = useState<JuezType[] | null>(null);
	const [id, setId] = useState<number>(0);


	const onEdit = (id: number) => {
		setId(id)
		modalDatos.open();
	};


	const fetchJueces = async () => {
		setListaJueces(await getJuecesListService());
	};
	useEffect(() => {
		fetchJueces();
	}, []);


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="jueces" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Listado de Jueces cargados</h4>
							</div>
							<div className="d-flex flex-row-reverse bd-highlight col-4">
								<button
									type="button"
									onClick={() => onEdit(0)}
									className="btn btn-primary m-1 btn-sm">Agregar</button>
							</div>
						</div>
					</div>
					<div className="tablaList">
						{
							listaJueces !== null ?
								(
									listaJueces.length > 0
										?
										<Tabla
											datos={listaJueces}
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
													No hay Jueces cargados, para agregar uno haga clic en el botón Agregra e ingrese los datos.
												</h5>
											</div>
										</div>
								)
								:
								<table className='table placeholder-glow'>
									<thead>
										<tr>
											<th className="text-center"><span>#</span></th>
											<th className=""><span>Apellido y Nombre</span></th>
											<th className=""><span>Mail</span></th>
											<th className=""><span>Telefono</span></th>
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
			<JuezModal
				id={id}
				fetchJueces={fetchJueces}
				close={modalDatos.close}
				modalRef={modalDatos.ref}
			/>
		</>
	)
}

export default Jueces;