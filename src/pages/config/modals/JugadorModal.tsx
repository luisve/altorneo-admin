import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { toast } from 'react-toastify';


import { URL_IMAGEN_JUGADOR, URL_IMAGES } from '../../../utils/constants';
import { Loading } from '../../../components/Loading';
import { DefaultParticipanteType, ParticipanteType } from '../../../types/config/ParticipanteType';
import { getJugadorService, postJugadorFormService } from '../../../services/config/JugadorService';
import QuickHelp from '../../../components/QuickHelp';
import { getParticipanteXDNIService } from '../../../services/config/ParticipanteService';
import { DefaultEquipoJugadorType, EquipoJugadorType } from '../../../types/config/EquipoJugadorType';


type ModalProps = {
	id: number | null;
	fetchJugadores: () => Promise<void>;
	idEquipo: number;
	isOpen: boolean;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const JugadorModal = ({
	id,
	fetchJugadores,
	idEquipo,
	isOpen,
	close,
	modalRef }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState<number>(0);
	const [srcImagen, setSrcImagen] = useState<string>('');
	const [cargandoImagen, setCargandoImagen] = useState<boolean>(true);


	const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
	const [form, setForm] = useState<ParticipanteType>(DefaultParticipanteType);
	const equipoJugador = useRef<EquipoJugadorType>(DefaultEquipoJugadorType);


	useEffect(() => {
		if (isOpen) {
			setImagenArchivo(null);
			setSrcImagen(URL_IMAGES + 'svg/j0.svg');
			const fechaActual = new Date();
			fechaActual.setFullYear(fechaActual.getFullYear() - 30);
			const fetchJugador = async (idJugador: number) => {
				setContadorLoading(1);
				getJugadorService(idJugador)
					.then((resp) => {
						if (resp.equipoJugador.Imagen !== "") {
							setSrcImagen(URL_IMAGEN_JUGADOR + resp.equipoJugador.Imagen);
						}
						setCargandoImagen(resp.equipoJugador.Imagen === "" ? false : true);
						equipoJugador.current = resp.equipoJugador;
						resp.participante.Puesto = resp.equipoJugador.Puesto;
						resp.participante.Numero = resp.equipoJugador.Numero;
						setForm(resp.participante);
					})
					.finally(() => { setContadorLoading(-1); })
			};
			if (id) {
				fetchJugador(id);
			} else {
				setForm((prev) => ({ ...prev, 'Id': null }));
			}
		}
	}, [isOpen]);


	const getXDNI = (dni: number) => {
		setContadorLoading(1);
		getParticipanteXDNIService(dni)
			//getJugadorXDNIService(dni)
			.then((resp) => {
				if (resp.code === 200) {
					if (resp.data) {
						setForm(resp.data);
						toast.warn('El jugador ya existe en el sistema.');
					}
				}
			})
			.finally(() => { setContadorLoading(-1) })
	}


	const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSrcImagen(URL.createObjectURL(file));
			setImagenArchivo(file);
		}
	}


	const post = () => {
		if ((form.Nombre === "") || (form.Apellido === "")) {
			toast.warning('Se debe cargar al menos nombre y apellido del jugador.', { autoClose: 3000, });
			return;
		}
		const formData = new FormData();
		if (imagenArchivo !== null) formData.append("Imagen", imagenArchivo);
		formData.append('participante', JSON.stringify(form));
		equipoJugador.current = {
			...equipoJugador.current
			, Id: id
			, IdEquipo: idEquipo
			, IdParticipante: form.Id ?? 0
			, Puesto: form.Puesto
			, Numero: form.Numero
		};
		formData.append('jugador', JSON.stringify(equipoJugador.current));
		/*
		Object.entries(form).forEach(([key, value]) => {
			formData.append(key, String(value));
		});
		*/
		setContadorLoading(1);
		postJugadorFormService(formData)
			.then((resp) => {
				if (resp.code === 200) {
					toast.success(resp.msg, { autoClose: 1000, });
					fetchJugadores();
					close();
				} else {
					toast.error(resp.msg, { autoClose: 3000, });
				}
			})
			.finally(() => { setContadorLoading(-1); })
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos del Jugador</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-9">
									<form className="form form-horizontal form-theme" >
										<fieldset>
											<div className="row">
												<div className="col-md-6">
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">DNI
															<QuickHelp helpText="Este dato no será visible para los navegantes del sitio, solo para el administrador y las listas de buena fe. Con este dato no es necesario cargar todos los campos del formulatio si participa en otro equipo u otra categoría del campeonato." /></label>
														<div className="col-md-8">
															<input
																type="number"
																className="form-control"
																id="DNI"
																name="DNI"
																placeholder="DNI"
																onChange={(e) => setForm((prev) => ({ ...prev, 'DNI': Number(e.target.value) }))}
																onBlur={(e) => getXDNI(Number(e.target.value))}
																value={form.DNI} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Nombre</label>
														<div className="col-md-8">
															<input
																type="text"
																className="form-control"
																id="Nombre"
																name="Nombre"
																placeholder="Nombre"
																max={32}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Nombre': e.target.value }))}
																value={form.Nombre} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Apellido" className="col-md-4 control-label">Apellido</label>
														<div className="col-md-8">
															<input
																type="text"
																className="form-control"
																id="Apellido"
																name="Apellido"
																placeholder="Apellido"
																max={32}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Apellido': e.target.value }))}
																value={form.Apellido} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Email
															<QuickHelp helpText="Estos datos privados no serán visibles para los usuarios, solo por el organizador del campeonato." />
														</label>
														<div className="col-md-8">
															<input
																type="text"
																className="form-control"
																id="Email"
																name="Email"
																placeholder="Email"
																max={64}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Email': e.target.value }))}
																value={form.Email} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Teléfono
															<QuickHelp helpText="Estos datos privados no serán visibles para los usuarios, solo por el organizador del campeonato." /></label>
														<div className="col-md-8">
															<input
																type="text"
																className="form-control"
																id="Telefono"
																name="Telefono"
																placeholder="Teléfono"
																max={32}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Telefono': e.target.value }))}
																value={form.Telefono} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Celular
															<QuickHelp helpText="Estos datos privados no serán visibles para los usuarios, solo por el organizador del campeonato." />
														</label>
														<div className="col-md-8">
															<input
																type="text"
																className="form-control"
																id="Celular"
																name="Celular"
																placeholder="Celular"
																max={16}
																onChange={(e) => setForm((prev) => ({ ...prev, 'Celular': e.target.value }))}
																value={form.Celular} />
														</div>
													</div>
												</div>
												<div className="col-6">
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Peso (kgs.)</label>
														<div className="col-md-8">
															<input
																type="number"
																className="form-control"
																id="Peso"
																name="Peso"
																placeholder="Peso en kgs."
																onChange={(e) => setForm((prev) => ({ ...prev, 'Peso': Number(e.target.value) }))}
																value={form.Peso} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Altura (cms.)</label>
														<div className="col-md-8">
															<input
																type="number"
																className="form-control"
																id="Altura"
																name="Altura"
																placeholder="Altura en cms."
																onChange={(e) => setForm((prev) => ({ ...prev, 'Altura': Number(e.target.value) }))}
																value={form.Altura} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Puesto</label>
														<div className="col-md-8">
															<input
																type="text"
																className="form-control"
																id="Puesto"
																name="Puesto"
																placeholder="Puesto"
																max={32}
																onChange={(e) => setForm((prev) => ({ ...prev, Puesto: e.target.value }))}
																value={form.Puesto} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Número</label>
														<div className="col-md-8">
															<input
																type="number"
																className="form-control"
																id="Numero"
																name="Numero"
																placeholder="Numero"
																onChange={(e) => setForm((prev) => ({ ...prev, Numero: Number(e.target.value) }))}
																value={form.Numero} />
														</div>
													</div>
													<div className="row">
														<label htmlFor="Nombre" className="col-md-4 control-label">Fecha Nacimiento</label>
														<div className="col-md-8">
															<input
																type="date"
																className="form-control"
																id="FechaNacimiento"
																name="FechaNacimiento"
																onChange={(e) => setForm((prev) => ({ ...prev, FechaNacimiento: e.target.value }))}
																value={form.FechaNacimiento.toString()} />
														</div>
													</div>
												</div>
											</div>
										</fieldset>
									</form>
								</div>
								<div className="col-md-3">
									<div className="card">
										<div className='card-body placeholder-glow'>
											<div className={`card-img-top placeholder-glow ${cargandoImagen ? '' : ' d-none'}`} style={{ height: "180px" }}>
												<span className="placeholder col-12" style={{ height: "100%", borderRadius: '5px' }}></span>
											</div>
											<img
												className={`card-img-top ${cargandoImagen ? ' d-none ' : ''}`}
												alt={form.Nombre + " " + form.Apellido}
												onLoad={() => setCargandoImagen(false)}
												onError={() => { setCargandoImagen(false) }}
												src={srcImagen} />
										</div>
										<div className="card-body">
											<h5 className="card-title">Sube una imagen</h5>
											<div className="form-group">
												<input
													type="file"
													className="form-control form-control-profile-img"
													name="Imagen"
													accept="image/*"
													onChange={(e) => { handleImage(e); }} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-primary btn-sm"
								disabled={form.Nombre === ""}
								onClick={post}>Confirmar</button>
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								aria-label="Cerrar"
								onClick={close}>Cerrar</button>
						</div>
					</div>
				</div>
			</div >
			<Loading contador={contadorLoading} />
		</>
	)
}
