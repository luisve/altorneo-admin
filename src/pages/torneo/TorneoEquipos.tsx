import { useState, useEffect, ChangeEvent, MouseEvent, useCallback } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


//import { DefaultEquipoType, EquipoType } from '../../types/config/EquipoType';
import { SelectType } from '../../types/SelectType';
import { DefaultEquipoView, EquipoView } from '../../views/config/EquipoView';


import { getTorneosCreadosSelectService } from '../../services/SelectService';
import { getEquiposXTorneoService, postTorneoEquipoCheckService, postTorneoRecargarEquipoService } from '../../services/torneo/TorneoEquipoService';


import { TorneoJugadoresModal } from './modals/TorneoJugadoresModal';
import { useBootstrapModal } from '../../hooks/useBootstrapModal';


export const TorneoEquipos = () => {


	const titulos = { "Id": "#", "Nombre": "Nombre", "NombreImagenEscudo": "Imagen", "Habilitado": "Habilitado", "Jugadores": "Jugadores" };
	const classNames = { "Id": "text-center", "NombreImagenEscudo": "text-center", "Habilitado": "text-center", "Jugadores": "text-center" };
	const tipoCampo = { "NombreImagenEscudo": "img", "Habilitado": "checkBox", "Jugadores": "btn" };

	const modalDatos = useBootstrapModal();
	const [loadingTorneoEquipos, setLoadingTorneoEquipos] = useState(0);


	const [listaEquipos, setListaEquipos] = useState<EquipoView[] | null>(null);
	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	const [idTorneo, setIdTorneo] = useState<number | null>(null);
	const [idEquipo, setIdEquipo] = useState<number | null>(null);
	const [equipo, setEquipo] = useState<EquipoView>(DefaultEquipoView);


	const fetchEquiposXTorneo = useCallback(async () => {
		if (idTorneo) {
			setLoadingTorneoEquipos(prev => prev + 1);
			const equipoList = await getEquiposXTorneoService(idTorneo);
			setLoadingTorneoEquipos(prev => prev - 1);
			setListaEquipos(equipoList);
		}
	}, [idTorneo]);


	useEffect(() => {
		if (idTorneo) {
			fetchEquiposXTorneo();
		} else {
			setListaEquipos([]);
		}
	}, [idTorneo, fetchEquiposXTorneo])


	const fetchTorneos = async () => {
		setLoadingTorneoEquipos(prev => prev + 1);
		const torneoList = await getTorneosCreadosSelectService();
		setLoadingTorneoEquipos(prev => prev - 1);
		setListaTorneos(torneoList);
		setIdTorneo(torneoList.length > 0 ? torneoList[0].Id : 0);
	};


	useEffect(() => {
		fetchTorneos();
	}, [])


	const checkEquipo = async (e: ChangeEvent<HTMLInputElement>) => {
		/** Se arma el json para subir */
		const jsonData = {
			IdTorneo: idTorneo,
			IdEquipo: Number(e.target.dataset.id),
			Habilitado: e.target.checked === true ? 1 : 0,
		};
		setLoadingTorneoEquipos(prev => prev + 1);
		const ret = await postTorneoEquipoCheckService(jsonData);
		setLoadingTorneoEquipos(prev => prev - 1);
		if (ret.code === 200) {
			toast.warning('Si el fixture estaba generado se debe hacer nuevamente desde el menú Torneo - Fechas.', { autoClose: 5000, });
			setListaEquipos((prevListaEquipos) =>
				(prevListaEquipos || []).map((equipo) =>
					equipo.Id === Number(e.target.dataset.id) ? { ...equipo, Habilitado: equipo.Habilitado === 0 ? 1 : 0 } : equipo
				)
			);
		}
	}


	const onClick = (e: MouseEvent<HTMLButtonElement>) => {
		let equipoId = Number(e.currentTarget.dataset.id);
		if (listaEquipos !== null) {
			let equipo: EquipoView | undefined = listaEquipos.find(equipo => equipo.Id === equipoId);
			if (!equipo) {
				return;
			}
			if (equipo.Habilitado === 1) {
				setEquipo(equipo);
				setIdEquipo(equipoId);
				modalDatos.open();
			} else {
				toast.warning('El Equipo no está habilitado.', { autoClose: 3000, });
			}
		}
	}


	const recargarEquipos = async () => {
		/** Se arma el json para subir */
		const jsonData = {
			Id: idTorneo
		};
		setLoadingTorneoEquipos(prev => prev + 1);
		const ret = await postTorneoRecargarEquipoService(jsonData);
		setLoadingTorneoEquipos(prev => prev - 1);
		if (ret.code === 200) {
			fetchEquiposXTorneo();
			toast.success(ret.msg, { autoClose: 1000 });
		}
	}


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="torneo equipos" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Equipos Habilitados para el Torneo</h4>
							</div>
						</div>
					</div>
					<div className="container">
						{
							listaTorneos !== null ?
								listaTorneos.length > 0 ?
									<div className="row">
										<div className="col-md-6">
											<label htmlFor="IdTorneo" >Torneos</label>
											<select
												className="form-select form-select-sm"
												onChange={(e) => { setIdTorneo(Number(e.target.value)) }}
												value={idTorneo ?? 0}
												id='IdTorneo'
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
										<div className="col-md-6">
											<div className='text-end'>
												<label htmlFor="BotonRecargar">Recargar Equipos</label>
											</div>
											<div className='text-end'>
												<button
													type="button"
													id='BotonRecargar'
													onClick={() => recargarEquipos()}
													className="btn btn-primary m-1 btn-sm">Recargar</button>
											</div>
										</div>
									</div>
									:
									<div className="card shadow-sm">
										<div className="card-body text-center py-5">
											<h5 className="fw-bold">
												No hay torneos creados para asignar los equipos, vaya a Torneo - Alta para generar uno nuevo.
											</h5>
										</div>
									</div>
								:
								<table className='sk'>
									<tbody>
										<tr ><td className='line'></td></tr>
									</tbody>
								</table>
						}
						<div className="tablaList">
							{
								loadingTorneoEquipos === 0
									?
									(
										listaEquipos && listaEquipos.length > 0
											?
											<Tabla
												datos={listaEquipos}
												titulos={titulos}
												classNames={classNames}
												keyField="Id"
												tipoCampo={tipoCampo}
												onCheck={checkEquipo}
												onClick={onClick}
												verPaginador={false}
												paginadoParam={100}
											/>
											:
											<>
												{
													listaTorneos !== null &&
													listaTorneos.length > 0 &&
													<div className="card shadow-sm">
														<div className="card-body text-center py-5">
															<h5 className="fw-bold">
																No hay Equipos para el torneo seleccionado, verifique que haya equipos que pertenecen a la categoría del torneo seleccionado
															</h5>
														</div>
													</div>
												}
												<div className="card shadow-sm">
													<div className="card-body text-center py-5">
														<p className="text-muted mb-4">
															Desde esta pantalla se habilitan los equipos para jugar el torneo, cuando finalice un torneo y comienza otro no hace falta cargar nuevamente los equipos, directamente se habilitan los participantes y se inicia.
														</p>
													</div>
												</div>
											</>
									)
									:
									<table className='table placeholder-glow'>
										<thead>
											<tr>
												<th className="text-center"><span>#</span></th>
												<th className=""><span>Nombre</span></th>
												<th className="text-center"><span>Imagen</span></th>
												<th className="text-center"><span>Habilitado</span></th>
												<th className="text-center"><span>Jugadores</span></th>
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
				<TorneoJugadoresModal
					idEquipo={idEquipo}
					idTorneo={idTorneo}
					equipo={equipo}
					isOpen={modalDatos.isOpen}
					close={modalDatos.close}
					modalRef={modalDatos.ref}
				/>
		</>
	)
}


export default TorneoEquipos;
/*
			{
				idEquipo !== null &&
			}
*/