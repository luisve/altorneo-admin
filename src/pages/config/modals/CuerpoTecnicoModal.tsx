import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import QuickHelp from '../../../components/QuickHelp';


import { Loading } from '../../../components/Loading';

import { getTecnicoService, postTecnicoService } from '../../../services/config/CuerpoTecnicoService';
import { getParticipanteXDNIService } from '../../../services/config/ParticipanteService';


import { DefaultEquipoCTType, EquipoCTType } from '../../../types/config/EquipoCTType';

import { URL_IMAGEN_TECNICO, URL_IMAGES } from '../../../utils/constants';
import { DefaultParticipanteType, ParticipanteType } from '../../../types/config/ParticipanteType';

type ModalProps = {
	id: number | null;
	idEquipo: number;
	fetchCuerpoTecnico: () => void;
	close: () => void;
	isOpen: boolean;
	modalRef: React.RefObject<HTMLDivElement>;
}


export const CuerpoTecnicoModal = ({
	id,
	idEquipo,
	fetchCuerpoTecnico,
	close,
	isOpen,
	modalRef }: ModalProps) => {

	const [contadorLoading, setContadorLoading] = useState(0);

	const [form, setForm] = useState<ParticipanteType>(DefaultParticipanteType);
	const equipoCT = useRef<EquipoCTType>(DefaultEquipoCTType)
	const [cargandoImagenPerfil, setCargandoImagenPerfil] = useState<boolean>(true);
	const [srcImagen, setSrcImagen] = useState<string>('');
	const [imgArchivo, setImgArchivo] = useState<File | null>(null);


	const getXDNI = (dni: number) => {
		setContadorLoading(1);
		getParticipanteXDNIService(dni)
			.then((resp) => {
				if (resp.data) {
					// si el participante ya existe se cargan los campos
					setForm((prev) => ({
						...prev
						, Id: resp.data?.Id ?? 0
						, Nombre: resp.data?.Nombre ?? ''
						, Apellido: resp.data?.Apellido ?? ''
						, Celular: resp.data?.Celular ?? ''
						, Email: resp.data?.Email ?? ''
					}));
					equipoCT.current = { ...equipoCT.current, IdParticipante: form.Id ?? 0 };
					toast.warn('El técnico ya existe en el sistema.');
				} else {
					setForm((prev) => ({ ...prev, Id: id, Nombre: '', Apellido: '', Celular: '', Email: '' }));
					equipoCT.current = { ...equipoCT.current, Id: null, IdParticipante: 0, IdImagen: 0 };
				}
			})
			.finally(() => { setContadorLoading(-1) })
	}


	const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSrcImagen(URL.createObjectURL(file));
			setImgArchivo(file);
		}
	}


	useEffect(() => {
		if (isOpen) {
			setImgArchivo(null);
			setSrcImagen(URL_IMAGES + 'svg/j0.svg');
			const fetchTecnico = async (id: number) => {
				setContadorLoading(1);
				getTecnicoService(id)
					.then((ct) => {
						if (ct.tecnico.Imagen !== '') {
							setCargandoImagenPerfil(true);
							setSrcImagen(URL_IMAGEN_TECNICO + ct.tecnico.Imagen);
						}
						equipoCT.current = ct.tecnico;
						setForm(ct.participante);
					})
					.finally(() => { setContadorLoading(-1); })
			};
			if (id) {
				fetchTecnico(id);
			} else {
				setForm(DefaultParticipanteType);
			}
		}
	}, [isOpen]);


	const postForm = () => {
		if (form.Nombre === "") {
			toast.warning('Debe al menos asignar un nombre al técnico.', { autoClose: 3000, });
			return;
		}
		const formData = new FormData();
		if (imgArchivo !== null) formData.append("Imagen", imgArchivo);
		formData.append('participante', JSON.stringify(form));
		equipoCT.current = { ...equipoCT.current, Id: id, IdEquipo: idEquipo, IdParticipante: form.Id ?? 0 };
		formData.append('tecnico', JSON.stringify(equipoCT.current))
		setContadorLoading(1);
		postTecnicoService(formData)
			.then((resp) => {
				if (resp.code === 200) {
					toast.success(resp.msg, { autoClose: 1000, });
					fetchCuerpoTecnico();
					close();
				} else {
					toast.error(resp.msg, { autoClose: 3000, });
				}
			})
			.finally(() => { setContadorLoading(-1); })
	}


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos del Director Técnico</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-12">
									<div className="row">
										<div className="col-md-6">
											<div className="row">
												<label htmlFor="Nombre" className="col-md-4 control-label">DNI
													<QuickHelp helpText="Este dato no será visible para los navegantes del sitio, solo para el administrador y las listas de buena fe. Con este dato no es necesario cargar todos los campos del formulatio si participa en otro equipo u otra categoría del campeonato." />
												</label>
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
										</div>
									</div>
								</div>
								<div className="col-md-8">
									<div className="row">
										<div className="col-md-6">
											<div className="row">
												<label htmlFor="nombreTecnico" className="col-md-4 control-label">Nombre</label>
												<div className="col-md-8">
													<input
														type="text"
														className="form-control"
														id="Nombre"
														name="Nombre"
														placeholder="Nombre"
														onChange={(e) => setForm(prev => ({ ...prev, 'Nombre': e.target.value }))}
														value={form.Nombre} />
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="row">
												<label htmlFor="nombreTecnico" className="col-md-4 control-label">Apellido</label>
												<div className="col-md-8">
													<input
														type="text"
														className="form-control"
														id="Apellido"
														name="Apellido"
														placeholder="Apellido"
														onChange={(e) => setForm(prev => ({ ...prev, 'Apellido': e.target.value }))}
														value={form.Apellido} />
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="row">
												<label htmlFor="celularTecnico" className="col-md-4 control-label">Celular</label>
												<div className="col-md-8">
													<input
														type="text"
														className="form-control"
														id="celularTecnico"
														name="celularTecnico"
														placeholder="Celular"
														onChange={(e) => setForm(prev => ({ ...prev, 'Celular': e.target.value }))}
														value={form.Celular} />
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="row">
												<label htmlFor="emailTecnico" className="col-md-4 control-label">Mail</label>
												<div className="col-md-8">
													<input
														type="text"
														className="form-control"
														id="emailTecnico"
														name="emailTecnico"
														placeholder="Mail"
														onChange={(e) => setForm(prev => ({ ...prev, 'Email': e.target.value }))}
														value={form.Email} />
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="card">
										<div className={`card-body ${cargandoImagenPerfil === true ? ' skimg ' : ''}`}>
											<img
												alt={form.Apellido + ' ' + form.Nombre}
												id="ImagenPerfil"
												className="card-img-top card-img-profile"
												onLoad={() => setCargandoImagenPerfil(false)}
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
													onChange={(e) => { handleImage(e); }}
													id="Imagen" />
											</div>
										</div>
									</div>
								</div>

							</div>
							<div className="row">
								<div className="col-md-6">
									<button
										type="button"
										className="btn btn-primary btn-confirmar btn-sm"
										onClick={postForm}>Agregar</button>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={close}>Cerrar</button>
						</div>
					</div>
				</div>
			</div >
			<Loading contador={contadorLoading} />
		</>
	)
}
