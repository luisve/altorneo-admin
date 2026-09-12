import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify';


import { URLROOT, URL_IMAGES } from '../../../utils/constants';
import { Loading } from '../../../components/Loading';
import { SelectType } from '../../../types/SelectType';
import { getSedeService, postSedeService } from '../../../services/config/SedesService';
import { DefaultSedeType, SedeType } from '../../../types/config/SedeType';
import { getCiudadSelectService } from '../../../services/SelectService';


type ModalProps = {
	id: number | null;
	listaPaises: SelectType[];
	fetchSedes: () => Promise<void>;
	isOpen: boolean;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const SedeModal = ({
	id,
	listaPaises,
	fetchSedes,
	isOpen,
	close,
	modalRef }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);
	const [fileImagenPerfil, setFileImagenPefil] = useState<File | null> (null);
	const [cargandoImg, setCargandoImg] = useState<boolean>(true);
	const [srcImagen, setSrcImagen] = useState<string>(URL_IMAGES + 'svg/sede.svg');
	const [listaCiudades, setListaCiudades] = useState<SelectType[]>([]);
	const [form, setForm] = useState<SedeType>(DefaultSedeType);


	const fetchCiudades = useCallback(async () => {
		setContadorLoading(1);
		const ciudadList = await getCiudadSelectService(form.IdPais);
		setListaCiudades(ciudadList);
		setContadorLoading(-1);
	}, [form.IdPais]);


	useEffect(() => {
		const fetchSede = (async (id: number) => {
			setContadorLoading(1);
			const sede = await getSedeService(id);
			sede.SrcImagenPefil = (sede.NombreImagenPerfil !== "") ? URLROOT + sede.NombreImagenPerfil : URL_IMAGES + 'svg/sede.svg';
			setSrcImagen((sede.NombreImagenPerfil !== "") ? URLROOT + sede.NombreImagenPerfil : URL_IMAGES + 'svg/sede.svg');
			setForm(sede);
			setContadorLoading(-1);
		});

		if (isOpen) {
			setForm(DefaultSedeType);
			setFileImagenPefil(null);
			setForm(prev => ({ ...prev, "SrcImagenPefil": URL_IMAGES + 'svg/sede.svg' }));
			if (id) {
				fetchSede(id);
			} else {
				if (listaPaises.length > 0) {
					setForm(prev => ({ ...prev, "Id": id, 'IdPais': listaPaises[0].Id }));
				}
			}
		}
	}, [isOpen, id]);


	useEffect(() => {
		if (form.IdPais !== 0) {
			fetchCiudades();
		}
	}, [form.IdPais, fetchCiudades]);


	const handleImage = (e: any) => {
		setFileImagenPefil(e.target.files[0]);
		setSrcImagen(URL.createObjectURL(e.target.files[0]));
	}


	const post = async () => {
		if (form.Nombre === "") {
			toast.warning('Debe al menos asignarle un nombre a la sede.', { autoClose: 3000, });
			return;
		};
		const formData = new FormData();
		Object.entries(form).forEach(([key, value]) => {
			formData.append(key, String(value));
		});
		if (fileImagenPerfil) {
			formData.append("ImagenPerfil", fileImagenPerfil);
		}
		setContadorLoading(1);
		const resp = await postSedeService(formData);
		setContadorLoading(-1);
		if (resp.code === 200) {
			toast.success(resp.msg, { autoClose: 1000, });
			fetchSedes();
			close();
		}
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos de la Sede</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-8">
									<form className="form form-horizontal form-theme">
										<fieldset>
											<div className="row">
												<label htmlFor="Nombre" className="col-md-4 control-label">Nombre</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className="form-control"
														id="Nombre"
														name="Nombre"
														placeholder="Nombre"
														value={form.Nombre}
														onChange={(e) => setForm(prev => ({ ...prev, "Nombre": e.target.value }))} />
												</div>
											</div>
											<div className="row">
												<label htmlFor="Telefono" className="col-md-4 control-label">Telefono</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className="form-control"
														id="Telefono"
														name="Telefono"
														placeholder="Teléfono"
														value={form.Telefono}
														onChange={(e) => setForm(prev => ({ ...prev, "Telefono": e.target.value }))} />
												</div>
											</div>
											<div className="row">
												<label htmlFor="Domicilio" className="col-md-4 control-label">Domicilio</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className="form-control"
														id="Domicilio"
														name="Domicilio"
														placeholder="Domicilio"
														value={form.Domicilio}
														onChange={(e) => setForm(prev => ({ ...prev, "Domicilio": e.target.value }))} />
												</div>
											</div>
											<div className="row">
												<label htmlFor="IdPais" className="col-md-4 control-label">País</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<select
														className="form-select"
														id="IdPais"
														name="IdPais"
														value={form.IdPais}
														onChange={(e) => { setForm(prev => ({ ...prev, "IdPais": Number(e.target.value) })) }}>
														{listaPaises.map((pais, index) => {
															return (
																<option
																	key={index}
																	value={pais.Id}>
																	{pais.Label}
																</option>
															)
														})}
													</select>
												</div>
											</div>
											<div className="row">
												<label htmlFor="IdCiudad" className="col-md-4 control-label">Ciudad</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<select
														className="form-select"
														id="IdCiudad"
														name="IdCiudad"
														value={form.IdCiudad}
														onChange={(e) => setForm(prev => ({ ...prev, "IdCiudad": Number(e.target.value) }))}>
														{listaCiudades.map((ciudad, index) => {
															return (
																<option
																	key={index}
																	value={ciudad.Id}>
																	{ciudad.Label}
																</option>
															)
														})}
													</select>
												</div>
											</div>
											<div className="row">
												<label htmlFor="Obs" className="col-md-4 control-label">Observaciones</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<textarea
														className="form-control input-sm"
														rows={3}
														id="Obs"
														value={form.Obs}
														name="Obs"
														onChange={(e) => setForm(prev => ({ ...prev, "Obs": e.target.value }))}></textarea>
												</div>
											</div>
										</fieldset>
									</form>
								</div>
								<div className="col-md-4">
									<div className="card">
										<div className={`card-body ${cargandoImg === true ? ' skimg ' : ''}`}>
											<img
												alt={form.Nombre}
												className="card-img-top card-img-profile"
												src={srcImagen}
												onLoad={() => setCargandoImg(false)}
												id="ImagenPerfilImg" />
										</div>
										<div className="card-body">
											<h5 className="card-title">Sube una imagen</h5>
											<div className="form-group">
												<input
													type="file"
													className="form-control form-control-profile-img"
													name="ImagenPerfil"
													accept="image/*"
													onChange={(e) => { handleImage(e) }}
													id="ImagenPerfil" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								onClick={post}
								disabled={form.Nombre === ''}
								className="btn btn-primary btn-sm">Confirmar</button>
							<button type="button"
								data-bs-dismiss="modal"
								aria-label="Cerrar"
								onClick={close}
								className="btn btn-secondary btn-sm">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	)
}