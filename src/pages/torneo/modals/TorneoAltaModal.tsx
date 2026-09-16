import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';


import { Loading } from '../../../components/Loading';


import { SelectType } from '../../../types/SelectType';


import { getTorneoService, postTorneoAltaService } from '../../../services/torneo/TorneoAltaService';


import { DefaultTorneoType, TorneoType } from '../../../types/torneo/TorneoType';
import { toDateFormat } from '../../../utils/formatDate';


type ModalProps = {
	id: number | null;
	fetchTorneos: () => void;
	listaCategorias: SelectType[];
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const TorneoAltaModal = ({
	id
	, fetchTorneos
	, listaCategorias
	, close
	, modalRef }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);
	const [form, setForm] = useState<TorneoType>(DefaultTorneoType);


	useEffect(() => {
		if (listaCategorias?.length > 0) {
			setForm(DefaultTorneoType);
			setForm((prev) => ({
				...prev,
				'FechaInicio': new Date(new Date().setDate(new Date().getDate() + 10))
				, 'IdCategoria': listaCategorias[0].Id
			}));
			const fetchTorneo = async (id: number) => {
				var torneo = await getTorneoService(id);
				torneo.FechaInicio = toDateFormat(torneo.FechaInicio.toString());
				setForm(torneo);
			};
			if (id) {
				fetchTorneo(id);
			}
		}
	}, [id, listaCategorias]);


	const post = async () => {
		if (form.Nombre === "") {
			toast.warning('Debe al menos asignarle un nombre al torneo.', { autoClose: 3000, });
			return;
		}
		setContadorLoading(1);
		postTorneoAltaService(form)
			.then((data) => {
				if (data.code === 200) {
					toast.success(data.msg);
					fetchTorneos();
					close();
				} else {
					toast.error(data.msg, { autoClose: 3000, });
				}
			})
			.finally(() => { setContadorLoading(-1); });
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Editar datos del Torneo</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col">
									<form className="form form-horizontal form-theme">
										<fieldset>
											<div className="row">
												<div className="col-md-6">
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Nombre</label>
														<div className="col-md-8">
															<input
																onFocus={(e) => e.target.select()}
																autoFocus={true}
																value={form.Nombre}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Nombre': e.target.value }))}
																type="text"
																className="form-control"
																id="Nombre"
																name="Nombre"
																aria-required="true" />
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<div className="row">
														<label htmlFor="IdCategoria" className="col-md-4 control-label">Categoría</label>
														<div className="col-md-8">
															<select
																value={form.IdCategoria}
																onChange={(e) => setForm((prev) => ({ ...prev, 'IdCategoria': Number(e.target.value) }))}
																className="form-select"
																id="IdCategoria"
																name="IdCategoria">
																{
																	listaCategorias !== null &&
																	listaCategorias.map((categoria, index) => {
																		return (
																			<option value={categoria.Id} key={index} >{categoria.Label}</option>
																		)
																	})
																}
															</select >
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-6">
													<div className="row">
														<label htmlFor="FechaInicio" className="col-md-4 control-label">F.Inicio</label>
														<div className="col-md-8">
															<input
																value={form.FechaInicio.toISOString().split('T')[0]}
																onChange={(e) => setForm((prev) => ({ ...prev, 'FechaInicio': toDateFormat(e.target.value) }))}
																type="date"
																className="form-control"
																id="FechaInicio"
																name="FechaInicio" />
														</div>
													</div >
												</div>
												<div className="col-md-6">
													<div className="row">
														<div className="col-md-4">
															<div className="row">
																<label htmlFor="Pago" className="col-md-6 control-label">Pago</label>
																<div className="col-md-6 form-switch">
																	<input
																		onChange={(e) => setForm(prevForm => ({ ...prevForm, Pago: e.target.checked === true ? 1 : 0 }))}
																		checked={form.Pago === 1}
																		type="checkbox"
																		className="form-check-input"
																		id="Pago"
																		role='switch'
																		name="Pago" />
																</div>
															</div>
														</div>
														{
															form.Pago === 1 &&
															<div className="col-md-8">
																<div className="row">
																	<label htmlFor="Costo" className="col-md-3 control-label">Costo</label>
																	<div className="col-md-9">
																		<input
																			value={form.Costo}
																			onChange={(e) => setForm((prev) => ({ ...prev, 'Costo': Number(e.target.value) }))}
																			type="number"
																			className="form-control"
																			id="Costo"
																			name="Costo" />
																	</div>
																</div>
															</div>
														}
													</div >
												</div>
											</div>
											<div className="row">
												<div className="col-6">
													<div className="row">
														<label htmlFor="PuntosGanado" className="col-md-6 control-label">Puntos Ganado</label>
														<div className="col-md-6">
															<input
																value={form.PuntosGanado}
																onChange={(e) => setForm((prev) => ({ ...prev, 'PuntoGanado': e.target.value }))}
																type="number"
																className="form-control"
																id="PuntosGanado"
																name="PuntosGanado"
																min="0" />
														</div>
													</div >
													<div className="row">
														<label htmlFor="PuntosEmpatado" className="col-md-6 control-label">Puntos Empate</label>
														<div className="col-md-6">
															<input
																value={form.PuntosEmpatado}
																onChange={(e) => setForm((prev) => ({ ...prev, 'PuntosEmpatado': Number(e.target.value) }))}
																type="number"
																className="form-control"
																id="PuntosEmpatado"
																name="PuntosEmpatado"
																min="0" />
														</div>
													</div >
												</div >
												<div className="col-6">
													<div className="row">
														<label htmlFor="PuntosPerdido" className="col-md-6 control-label">Puntos Perdido</label>
														<div className="col-md-6">
															<input
																value={form.PuntosPerdido}
																onChange={(e) => setForm((prev) => ({ ...prev, 'PuntosPerdido': Number(e.target.value) }))}
																type="number"
																className="form-control"
																id="PuntosPerdido"
																name="PuntosPerdido"
																min="0" />
														</div>
													</div >
													<div className="row">
														<label htmlFor="Jugadores" className="col-md-6 control-label">Jugadores</label>
														<div className="col-md-6">
															<input
																value={form.Jugadores}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Jugadores': Number(e.target.value) }))}
																type="number"
																className="form-control"
																id="Jugadores"
																name="Jugadores"
																min="0" />
														</div>
													</div >
												</div >
											</div >
										</fieldset >
									</form >
								</div >
							</div >
						</div >
						<div className="modal-footer" >
							<button
								type="button"
								onClick={post}
								disabled={form.Nombre === ''}
								className="btn btn-primary btn-sm"> Confirmar</button >
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								onClick={close}
								aria-label="Cerrar"> Cerrar</button >
						</div >
					</div >
				</div >
			</div >
			<Loading contador={contadorLoading} />
		</>
	)
}
