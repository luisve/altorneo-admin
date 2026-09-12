import { useState, useEffect, MouseEvent, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Tabla } from '../../components/Tabla';


import { EquipoView, DefaultEquipoView } from '../../views/config/EquipoView';
import { SelectType } from '../../types/SelectType';


import { TorneoEquipoPagoModal } from './modals/TorneoEquiposPagosModal';


import { getTorneoPagosListService } from '../../services/torneo/TorneoEquipoPagoService';
import { getEquiposXTorneoService } from '../../services/torneo/TorneoEquipoService';


import { useBootstrapModal } from '../../hooks/useBootstrapModal';


export const TorneoPagos = () => {

	const modalDatos = useBootstrapModal();

	const titulos = { "Id": "#", "Nombre": "Nombre", "Saldo": "Saldo" };
	const classNames = { "Id": "text-center" };
	const botones = useRef(["Cash"]);
	const cssSaldo = useRef<string[]>([]);
	const trCSS = cssSaldo.current;


	const [listaEquipos, setListaEquipos] = useState<EquipoView[] | null>(null);
	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	const [idTorneo, setIdTorneo] = useState<number>(0);
	const [idEquipo, setIdEquipo] = useState<number | null>(null);
	const [equipo, setEquipo] = useState<EquipoView>(DefaultEquipoView);


	const fetchEquiposXTorneo = useCallback(async () => {
		if (idTorneo > 0) {
			const equipoList = await getEquiposXTorneoService(idTorneo);

			const torneoActual = listaTorneos?.find(torneo => torneo.Value === "Pago");
			if (torneoActual === undefined) {
				botones.current = [];
				//setListaEquipos(equipoList.map(({ Saldo, ...sinSaldo }) => sinSaldo));
				setListaEquipos(equipoList.map(equipo => ({
					...equipo,
					Saldo: equipo.Saldo ?? 0
				})))
			} else {
				cssSaldo.current = equipoList.map((equipo) => (equipo.Saldo || 0) > 0 ? ' bg-warning-claro ' : '');
				botones.current = ["Cash"];
				setListaEquipos(equipoList);
			}
		}
	}, [idTorneo, listaTorneos]);


	useEffect(() => {
		if (idTorneo !== 0) {
			fetchEquiposXTorneo();
		} else {
			setListaEquipos([]);
		}
	}, [idTorneo, fetchEquiposXTorneo])


	const fetchTorneos = async () => {
		// const torneoList = await getTorneosCreadosSelectService();
		const torneoList = await getTorneoPagosListService();
		setListaTorneos(torneoList);
		setIdTorneo(torneoList.length > 0 ? torneoList[0].Id : 0);
	};


	useEffect(() => {
		fetchTorneos();
	}, [])

/*
	const [showModalPago, setShowModalPago] = useState(false);
	const onShowModalPago = (value: boolean) => {
		if (value === false) {
			setIdEquipo(null);
		}
		setShowModalPago(value);
	};
*/

	const onClicPago = (idEquipo: number) => {
		setEquipo(listaEquipos?.find(equipo => equipo.Id === idEquipo) ?? ({} as EquipoView));
		setIdEquipo(idEquipo);
		modalDatos.open();
	};


	const onClick = (e: MouseEvent<HTMLButtonElement>) => {
		let equipoId = Number(e.currentTarget.dataset.id);
		if (listaEquipos !== null) {
			let equipo: EquipoView | undefined = listaEquipos.find(equipo => equipo.Id === equipoId);
			//console.log(equipo);
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


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="torneo equipos" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Equipos con saldo Pendiente en el Torneo</h4>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row my-2">
							{
								listaTorneos !== null
									?
									listaTorneos.length > 0
										?
										<div className="col-md-6">
											<label htmlFor="IdTorneo" >Torneos</label>
											<select
												className="form-select form-select-sm"
												onChange={(e) => { setIdTorneo(Number(e.target.value)) }}
												value={idTorneo}
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
										:
										<div className="card shadow-sm">
											<div className="card-body text-center py-5">
												<h5 className="fw-bold">
													No hay torneos creados para asignar los equipos.
												</h5>
											</div>
										</div>
									:
									// Se estan cargando los torneos 
									<div className='placeholder-glow'>
										<span className='w-100 placeholder'>&nbsp;</span>
									</div>
							}
						</div>
						<div className="tablaList">
							{
								listaEquipos !== null
									?
									(
										listaEquipos.length > 0
											?
											<Tabla
												datos={listaEquipos}
												titulos={titulos}
												classNames={classNames}
												keyField="Id"
												onClick={onClick}
												botones={botones.current}
												verPaginador={false}
												paginadoParam={100}
												trCSS={trCSS}
												onClicCash={onClicPago} />
											:
											<>
												{
													listaTorneos !== null &&
													listaTorneos.length > 0 &&
													<div className="card shadow-sm">
														<div className="card-body text-center py-5">
															<h5 className="fw-bold">
																No hay Equipos para el torneo seleccionado, verifique que haya equipos que pertenecen a la categoría del torneo seleccionado.
															</h5>
														</div>
													</div>
												}
												<div className="card shadow-sm">
													<div className="card-body text-center py-5">
														<p className="text-muted mb-4">
															Desde esta pantalla se ingresan los pagos de los equipos para los torneos que así lo requieran.
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
												<th className=""><span>Saldo</span></th>
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
				/*
				idEquipo !== null && showModal === true &&
				<TorneoJugadoresModal
					show={showModal}
					onShow={onShow}
					idEquipo={idEquipo}
					idTorneo={idTorneo}
					equipo={equipo}
				/>
				*/
			}
				<TorneoEquipoPagoModal
					idEquipo={idEquipo}
					idTorneo={idTorneo}
					saldo={equipo.Saldo ?? 0}
					fetchEquipos={fetchEquiposXTorneo}
					close={modalDatos.close}
					modalRef={modalDatos.ref}
				/>
		</>
	)
}


export default TorneoPagos;