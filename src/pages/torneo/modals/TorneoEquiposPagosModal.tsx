import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


import { DefaultTorneoEquipoPagoType, TorneoEquipoPagoType } from "../../../types/torneo/TorneoEquipoPagoType";


import { getTorneoEquipoPagosService, postTorneoEquipoPagoService } from "../../../services/torneo/TorneoEquipoPagoService";
import { TorneoEquipoPagoView } from "../../../views/torneo/TorneoEquipoPagoView";
import { API } from "../../../utils/constants";


type ModalProps = {
	idEquipo: number | null;
	idTorneo: number;
	saldo: number;
	fetchEquipos: () => void;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const TorneoEquipoPagoModal = ({
	idTorneo
	, idEquipo
	, saldo
	, fetchEquipos
	, close
	, modalRef }: ModalProps) => {


	const [form, setForm] = useState<TorneoEquipoPagoType>(DefaultTorneoEquipoPagoType);
	const [listaPagos, setListaPagos] = useState<TorneoEquipoPagoView[] | null>(null);


	const formatoMoneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2, });

	useEffect(() => {
		if (!idEquipo) {
			return;
		}
		setListaPagos(null);
		const fetchPagos = async () => {
			try {
				const pagosList = await getTorneoEquipoPagosService(idTorneo, idEquipo);
				setListaPagos(pagosList.map(item => ({ ...item, LinkPDF: API + "Admin/TorneoEquiposPagos/GetRecibo?IdRecibo=" + item.Id })));
			} catch (error) {
				console.error("Error cargando pagos:", error);
			}
		};

		const hoy = new Date();
		setForm(prevForm => ({ ...prevForm, FechaPago: hoy, IdEquipo: idEquipo, IdTorneo: idTorneo }));
		fetchPagos();

	}, [idEquipo, idTorneo]);


	const postPago = async () => {
		if (saldo < form.Importe) {
			toast.warning('El importe a asignar es mayor al saldo pendiente.');
			return;
		}
		if (form.Importe < 0.01) {
			toast.warning('No se ha ingresado un importe para el pago.');
			return;
		}
		const ret = await postTorneoEquipoPagoService(form);
		if (ret.code === 200) {
			toast.success(ret.msg, { autoClose: 1000 });
			close();
			fetchEquipos();
		}
	}


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Ingresar nuevo pago, Saldo: {saldo}</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							{saldo > 0 &&
								<div className="row">
									<div className="col-md-4">
										<div className="row mb-2">
											<label htmlFor="Importe" className="col-md-6 control-label">Fecha</label>
											<div className="col-md-12">
												<input
													onFocus={(e) => e.target.select()}
													autoFocus={true}
													value={form.FechaPago.toISOString().split('T')[0]}
													onChange={(e) => setForm(prevForm => ({ ...prevForm, FechaPago: new Date(e.target.value) }))}
													type="date"
													className="form-control"
													id="Fecha"
													name="Fecha"
													aria-required="true" />
											</div>
										</div>
									</div>
									<div className="col-md-4">
										<div className="row mb-2">
											<label htmlFor="Importe" className="col-md-6 control-label">Importe</label>
											<div className="col-md-12">
												<input
													onFocus={(e) => e.target.select()}
													value={form.Importe}
													onChange={(e) => setForm(prevForm => ({ ...prevForm, Importe: Number(e.target.value) }))}
													type="number"
													className="form-control"
													id="Importe"
													name="Importe"
													aria-required="true" />
											</div>
										</div>
									</div>
									<div className="col-md-4">
										<div className="row mb-2">
											<label htmlFor="NComprobante" className="col-md-6 control-label">Num.Comprobante</label>
											<div className="col-md-12">
												<input
													onFocus={(e) => e.target.select()}
													value={form.NComprobante}
													onChange={(e) => setForm(prevForm => ({ ...prevForm, NComprobante: Number(e.target.value) }))}
													type="number"
													className="form-control"
													id="NComprobante"
													name="NComprobante" />
											</div>
										</div>
									</div>
									<div className="col-md-12">
										<div className="row mb-2">
											<label htmlFor="Obs" className="col-md-2 control-label">Observaciones</label>
											<div className="col-md-10">
												<textarea
													onFocus={(e) => e.target.select()}
													value={form.Obs}
													onChange={(e) => setForm(prevForm => ({ ...prevForm, Obs: e.target.value }))}
													className="form-control"
													id="Obs"
													name="Obs"
												></textarea>
											</div>
										</div>
									</div>
									<div className="col-md-12 text-end">
										<button
											type="button"
											className="btn btn-primary btn-sm"
											onClick={() => postPago()}
											aria-label="Confirmar">Confirmar</button >
									</div>
								</div>
							}
							<div className="row">
								{
									listaPagos === null
										?
										(
											Array.from({ length: 6 }).map((_, index) => (
												<div className="row g-0 text-center placeholder-glow mt-1" key={index}>
													<div className="col-4 col-md-4 border py-3 placeholder"></div>
													<div className="col-4 col-md-4 border py-3  placeholder"></div>
													<div className="col-4 col-md-4 border py-3 placeholder"></div>
												</div>
											))
										)
										:
										listaPagos.length > 0 &&
										(
											<div className="col-md-12">
												<div className="row g-2 text-center fw-bold mt-2">
													<div className="col-2 col-md-2 border">
														<span>Fecha</span>
													</div>
													<div className="col-2 col-md-2 border">
														<span>Importe</span>
													</div>
													<div className="col-7 col-md-7 border">
														<span>Obs.</span>
													</div>
													<div className="col-1 col-md-1 border">
														<span>Recibo</span>
													</div>
												</div>
												{
													listaPagos.map((pago, index) => (
														<div className="row g-2 text-center" key={index}>
															<div className="col-2 col-md-2 border">
																<span>{pago.FechaPago}</span>
															</div>
															<div className="col-2 col-md-2 border text-end">
																<span>{formatoMoneda.format(pago.Importe)}</span>
															</div>
															<div className="col-7 col-md-7 border text-start">
																<span>{pago.Obs}</span>
															</div>
															<div className="col-1 col-md-1 border">
																<a href={pago.LinkPDF}
																	target="_blank" rel="noopener noreferrer">
																	<i className="fa fa-file-pdf"></i>
																</a>
															</div>
														</div>
													))
												}
											</div>
										)
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}