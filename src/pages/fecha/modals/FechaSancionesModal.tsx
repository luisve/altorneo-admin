import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


import { SancionType } from '../../../types/fecha/SancionType';


import { getListaFechaInhabilitadaXJugadorService, getListaFechaService } from '../../../services/fecha/FechaService';
import { postFechasInhabilitadoService, postTarjetasDescontarService } from '../../../services/fecha/SancionService';


type ModalProps = {
	show: boolean,
	onShow: (val: boolean) => void,
	jsJugador: SancionType,
	idTorneo: number,
}


export type listaFechasInhabilitadasType = {
	FechaNumero: number,
	IdFecha: number,
	Inhabilitado: boolean,
}


export const FechaTarjetasModal = ({ show, onShow, jsJugador, idTorneo }: ModalProps) => {


	const [jsonListaFechas, setJsonListaFechas] = useState<listaFechasInhabilitadasType[]>([]);
	const [contadorLoading, setContadorLoading] = useState(0);
	const [descontarAmarillas, setDescontarAmarillas] = useState(jsJugador.AAcumuladas);
	const [descontarRojas, setDescontarRojas] = useState(jsJugador.RAcumuladas);


	const handleClose = () => {
		onShow(false);
	};


	const handleCheckFecha = (fechaNumero: Number) => {
		setJsonListaFechas(
			jsonListaFechas.map(fechaInhabilitar => {
				if (fechaInhabilitar.FechaNumero === fechaNumero) {
					if (fechaInhabilitar.Inhabilitado === true) {
						return { ...fechaInhabilitar, Inhabilitado: false };
					} else {
						return { ...fechaInhabilitar, Inhabilitado: true };
					}
				}
				return fechaInhabilitar;
			})
		);
	}


	useEffect(() => {
		setContadorLoading(1);
		Promise.all([getListaFechaService(idTorneo), getListaFechaInhabilitadaXJugadorService(idTorneo, jsJugador.IdJugador)])
			.then(([listaFechas, listaFechasInhabilitadas]) => {
				let jsonDatos = listaFechas.map(rFecha => {
					let idFecha = rFecha.FechaZona?.[0]?.IdFecha ?? 0;
					return {
						FechaNumero: rFecha.FechaNumero || 0,
						IdFecha: idFecha,
						Inhabilitado: listaFechasInhabilitadas.some(jugador => jugador.IdFecha === idFecha)
					}
				});
				setJsonListaFechas(jsonDatos);
			})
			.finally(() => { setContadorLoading(-1) });
	}, [idTorneo, jsJugador.IdJugador]);


	const postDescontarRojas = () => {
		if (descontarRojas > jsJugador.RAcumuladas) {
			toast.warning('Se está intentando descontar mas tarjetas que las acumuladas.', { autoClose: 3000, });
			return;
		}
		let json = {
			IdJugador: jsJugador.IdJugador,
			IdTorneo: idTorneo,
			RRestadas: Number(descontarRojas)
		}
		setContadorLoading(1);
		postTarjetasDescontarService(json)
			.then((ret) => {
				toast.success(ret.msg, { autoClose: 1000, });
				onShow(false);
			})
			.finally(() => { setContadorLoading(-1) });
	}


	const postDescontarAmarillas = () => {
		if (descontarAmarillas > jsJugador.AAcumuladas) {
			toast.warning('Se está intentando descontar mas tarjetas que las acumuladas.', { autoClose: 3000, });
			return;
		}
		let json = {
			IdJugador: jsJugador.IdJugador,
			IdTorneo: idTorneo,
			ARestadas: Number(descontarAmarillas)
		};
		setContadorLoading(1);
		postTarjetasDescontarService(json)
			.then((ret) => {
				toast.success(ret.msg, { autoClose: 1000, });
				onShow(false);
			})
			.finally(() => { setContadorLoading(-1) });
	}


	const postFechas = () => {
		let jsonBody = jsonListaFechas
			.filter(fechaInhabilitar => fechaInhabilitar.Inhabilitado === true)
			.map(fechaInhabilitar => { return { IdTorneo: idTorneo, IdJugador: jsJugador.IdJugador, IdFecha: fechaInhabilitar.IdFecha } }
			);
		setContadorLoading(1);
		postFechasInhabilitadoService(jsonBody)
			.then(ret => {
				toast.success(ret.msg, { autoClose: 1000 });
				onShow(false);
			})
			.finally(() => { setContadorLoading(-1) });
	};


	return (
		<>
			<div
				className={`modal fade ${show ? 'show' : ''}`}
				style={{ display: show ? 'block' : 'none' }} >
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Administrar Sanciones </h5>
							<button
								onClick={handleClose}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Cerrar"></button>
						</div>
						<div className="modal-body">
							<form className="form form-horizontal form-theme">
								<fieldset>
									<div className="row">
										<div className="col-md-6">
											<div className="text-center">
												<h5>Tarjetas Amarillas</h5>
											</div>
											{
												contadorLoading > 0
													?
													<div className='line'></div>
													:
													<div className="row">
														<label htmlFor="AmarillasAcumuladas" className="col-md-6 control-label text-end">Acumuladas</label>
														<div className="col-md-3">
															<input type="text" className="form-control" id="AmarillasAcumuladas" name="AmarillasAcumuladas" placeholder="0"
																readOnly
																value={jsJugador.AAcumuladas} />
														</div>
													</div>
											}
											{
												contadorLoading > 0
													?
													<div className='line'></div>
													:
													<>
														<div className="row">
															<label htmlFor="descontarAmarillas" className="col-md-6 control-label text-end">Descontar</label>
															<div className="col-md-3">
																<input type="text" className="form-control" id="descontarAmarillas" name="descontarAmarillas" placeholder="0"
																	onChange={(e) => setDescontarAmarillas(Number(e.target.value))}
																	value={descontarAmarillas} />
															</div>
														</div>
														<div className="row">
															<div className="col-md-12 text-center">
																<button
																	type="button"
																	className="btn btn-primary btn-sm"
																	data-bs-dismiss="modal"
																	aria-label="Close"
																	disabled={jsJugador.AAcumuladas === 0}
																	onClick={postDescontarAmarillas}>Descontar</button>
															</div>
														</div>
													</>
											}
										</div>
										<div className="col-md-6">
											<div className="text-center">
												<h5>Tarjetas Rojas</h5>
											</div>
											{
												contadorLoading > 0
													?
													<div className='line'></div>
													:
													<div className="row">
														<label htmlFor="TarjetasRojas" className="col-md-6 control-label text-end">Acumuladas</label>
														<div className="col-md-3">
															<input type="text" className="form-control" id="TarjetasRojas" name="TarjetasRojas" placeholder="0"
																readOnly
																value={jsJugador.RAcumuladas} />
														</div>
													</div>
											}
											{
												contadorLoading > 0
													?
													<div className='line'></div>
													:
													<div className="row">
														<label htmlFor="descontarRojas" className="col-md-6 control-label text-end">Descontar</label>
														<div className="col-md-3">
															<input type="text" className="form-control" id="descontarRojas" name="descontarRojas" placeholder="0"
																onChange={(e) => setDescontarRojas(Number(e.target.value))}
																value={descontarRojas} />
														</div>
														<div className="col-md-12 text-center">
															<button
																type="button"
																className="btn btn-primary btn-sm"
																data-bs-dismiss="modal"
																aria-label="Close"
																disabled={jsJugador.RAcumuladas === 0}
																onClick={postDescontarRojas}>Descontar</button>
														</div>
													</div>
											}

										</div>
									</div>
								</fieldset>
							</form>
							<div className="text-center my-3">
								<h6>Reiniciar las tarjetas a 0 y seleccionar las fechas de suspensión.</h6>
							</div>
							<div className="card my-3">
								<div className="row text-center">
									<h3>Fechas de suspensión</h3>
								</div>
								<div className="d-flex overflow-auto">
									<div className="btn-group d-flex justify-content-center w-100 m-2">
										{
											jsonListaFechas != null ?
												jsonListaFechas.map((fecha, index) => {
													return (
														<button
															key={index}
															type="button"
															onClick={((e) => handleCheckFecha(Number(e.currentTarget.dataset.fechanumero)))}
															className={`btn btn-sm ${fecha.Inhabilitado === true ? "btn-danger" : "btn-outline-danger"}`}
															data-fechanumero={fecha.FechaNumero}>{fecha.FechaNumero}</button>
													)
												})
												:
												<table className='sk'><tbody><tr ><td className='line'></td></tr></tbody></table>
										}
									</div>
								</div>
								<div className="col-md-12 text-center p-2">
									<button
										type="button"
										className="btn btn-primary btn-sm"
										data-bs-dismiss="modal"
										aria-label="Close"
										onClick={postFechas} > Confirmar Fechas</button>
								</div>
							</div>
						</div>
						<div className="modal-footer">
						</div>
					</div >
				</div >
			</div>
			<div className="modal-backdrop fade show"></div>
		</>
	)
}

