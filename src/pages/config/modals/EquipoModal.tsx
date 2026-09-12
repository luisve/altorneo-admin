import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


import { URLROOT, URL_IMAGES } from '../../../utils/constants';
import { SelectType } from '../../../types/SelectType';
import { DefaultEquipoType, EquipoType } from '../../../types/config/EquipoType';
import { getEquipoService, postEquipoService } from '../../../services/config/EquipoService';
import { Loading } from '../../../components/Loading';
import { getCuerpoTecnicoListService, postSwitchCTService } from '../../../services/config/CuerpoTecnicoService';
import { CuerpoTecnicoView } from '../../../views/config/CuerpoTecnicoView';


// import { TecnicoModal } from './CuerpoTecnicoModal';
// import { useBootstrapModal } from '../../../hooks/useBootstrapModal';


type ModalProps = {
	id: number | null;
	listaCategorias: SelectType[] | null;
	fetchEquipos: () => Promise<void>;
	close: () => void;
	isOpen: boolean;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const EquipoModal = ({
	id,
	listaCategorias,
	fetchEquipos,
	close,
	isOpen,
	modalRef }: ModalProps) => {


	const navigate = useNavigate();
	const [contadorLoading, setContadorLoading] = useState(0);
	//	const modalTecnico = useBootstrapModal();

	const [srcImagenPerfil, setSrcImagenPerfil] = useState<string>(URL_IMAGES + 'svg/equipo.svg');
	const [srcImagenEscudo, setSrcImagenEscudo] = useState<string>(URL_IMAGES + 'svg/escudo.svg');
	const [imgPerfilArchivo, setImgPerfilArchivo] = useState<File | null>(null);
	const [imgEscudoArchivo, setImgEscudoArchivo] = useState<File | null>(null);

	const [cargandoImgEquipo, setCargandoImgEquipo] = useState<boolean>(true);
	const [cargandoImgEscudo, setCargandoImgEscudo] = useState<boolean>(true);

	const [form, setForm] = useState<EquipoType>(DefaultEquipoType);
	const [ctLista, setCTLista] = useState<CuerpoTecnicoView[] | null>(null);


	useEffect(() => {
		setForm(DefaultEquipoType);
		setImgPerfilArchivo(null);
		setImgEscudoArchivo(null);
		if (listaCategorias) {
			setForm(prev => ({ ...prev, 'IdCategoria': listaCategorias[0].Id }));
		}
		setSrcImagenPerfil(URL_IMAGES + 'svg/equipo.svg');
		setSrcImagenEscudo(URL_IMAGES + 'svg/escudo.svg');
		const fetchEquipo = async (id: number) => {
			setContadorLoading(1);
			getEquipoService(id)
				.then((equipo) => {
					setSrcImagenPerfil((equipo.NombreImagenPerfil !== "") ? URLROOT + equipo.NombreImagenPerfil : URL_IMAGES + 'svg/equipo.svg');
					setSrcImagenEscudo((equipo.NombreImagenEscudo !== "") ? URLROOT + equipo.NombreImagenEscudo : URL_IMAGES + 'svg/escudo.svg');
					setForm(equipo);
				})
				.finally(() => { setContadorLoading(-1); })
		};
		const fetchCuerpoTecnico = async (idEquipo: number) => {
			setContadorLoading(1);
			getCuerpoTecnicoListService(idEquipo)
				.then((lista) => {
					setCTLista(lista);
				})
				.finally(() => { setContadorLoading(-1) })
		}
		setCTLista(null);
		if (isOpen) {
			setForm(DefaultEquipoType);
			if (id) {
				fetchEquipo(id);
				fetchCuerpoTecnico(id);
			}
		}
	}, [isOpen]);


	const handleImagePerfil = (e: any) => {
		setSrcImagenPerfil(URL.createObjectURL(e.target.files[0]));
		setImgPerfilArchivo(e.target.files[0]);
	}

	const handleImageEscudo = (e: any) => {
		setSrcImagenEscudo(URL.createObjectURL(e.target.files[0]));
		setImgEscudoArchivo(e.target.files[0]);
	}


	const handleSwitchCT = async (id: number) => {
		setContadorLoading(1);
		postSwitchCTService(id)
			.then((re) => {
				if (re.code === 200) {
					if (ctLista) {
						const listact = ctLista.map(ct =>
							ct.Id === id
								? { ...ct, Activo: ct.Activo ? false : true }
								: ct
						);
						setCTLista(listact);
					}
				}
			})
			.finally(() => { setContadorLoading(-1) });
	}


	const postForm = async () => {
		if (form.Nombre === "") {
			toast.warning('No se ha cargado el nombre del equipo.', { autoClose: 3000, });
			return;
		};
		const formData = new FormData();
		if (imgPerfilArchivo !== null) formData.append("ImagenPerfil", imgPerfilArchivo);
		if (imgEscudoArchivo !== null) formData.append("ImagenEscudo", imgEscudoArchivo);
		Object.entries(form).forEach(([key, value]) => {
			formData.append(key, value);
		});
		setContadorLoading(1);
		const resp = await postEquipoService(formData);
		setContadorLoading(-1);
		if (resp.code === 200) {
			toast.success(resp.msg, { autoClose: 1000, });
			fetchEquipos();
			close();
		}
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos del Equipo</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-6">
									<form className="form form-horizontal">
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
														onChange={(e) => setForm(prev => ({ ...prev, 'Nombre': e.target.value }))}
														value={form.Nombre} />
												</div>
											</div>
											<div className="row">
												<label htmlFor="Instagram" className="col-md-4 control-label">Instagram</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<span style={{ marginLeft: '-16px', float: 'left', fontWeight: 'bold' }} >@</span>
													<input
														type="text"
														className="form-control"
														id="Instagram"
														name="Instagram"
														placeholder=""
														onChange={(e) => setForm(prev => ({ ...prev, 'Instagram': e.target.value }))}
														value={form.Instagram} />
												</div>
											</div>
											<div className="row">
												<label htmlFor="IdCategoria" className="col-md-4 control-label">Categoría</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													{
														listaCategorias &&
														listaCategorias.length > 0 &&
														<select className="form-select" id="IdCategoria" name="IdCategoria"
															onChange={(e) => setForm(prev => ({ ...prev, 'IdCategoria': Number(e.target.value) }))}
															value={form.IdCategoria}>
															{
																listaCategorias.map((categoria, index) => {
																	return (
																		<option value={categoria.Id} key={index}>{categoria.Label}</option>
																	)
																})
															}
														</select>
													}
												</div>
											</div>
											<div className="row">
												<label htmlFor="Observaciones" className="col-md-4 control-label">Observaciones</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<textarea
														className="form-control input-sm"
														id="Observaciones"
														name="Observaciones"
														onChange={(e) => setForm(prev => ({ ...prev, 'Observaciones': e.target.value }))}
														value={form.Observaciones}></textarea>
												</div>
											</div>
										</fieldset>
									</form>
									{
										id !== null &&
										<table className="table table-striped">
											<thead>
												<tr>
													<th>Apellido</th>
													<th>Nombre</th>
													<th>Activo</th>
												</tr>
											</thead>
											<tbody>
												{
													ctLista !== null ?
														ctLista.map((ct, index) => {
															return (
																<tr key={index}>
																	<td>{ct.Apellido}</td>
																	<td>{ct.Nombre}</td>
																	<td>
																		<input
																			type="checkbox"
																			id={'chCT_' + ct.Id}
																			checked={ct.Activo}
																			onChange={() => { handleSwitchCT(ct.Id) }}
																			className="form-check-input cursor-pointer"
																		/>
																	</td>
																</tr>
															)
														})
														:
														Array(5).fill(0).map((_, index) => (
															<tr key={index}>
																{
																	Array(3).fill(0).map((_, index) => (
																		<td className='placeholder-glow' key={index}>
																			<span className='w-100 placeholder'>&nbsp;</span>
																		</td>
																	))
																}
															</tr>
														))
												}
											</tbody>
										</table>
									}
								</div>
								<div className="col-md-3">
									<div className="card">
										<div className="card-header text-center">
											<span>Equipo</span>
										</div>
										<div className={`card-body ${cargandoImgEquipo === true ? ' skimg ' : ''}`}>
											<img
												alt={form.Nombre}
												className="card-img-top card-img-profile"
												src={srcImagenPerfil}
												onLoad={() => setCargandoImgEquipo(false)}
												id="ImagenPerfilImg" />
										</div>
										<div className="card-footer">
											<h6>Sube una imagen</h6>
											<div className="form-group">
												<input type="file" className="form-control form-control-profile-img" name="ImagenPerfil" accept="image/*" id="ImagenPerfil"
													onChange={(e) => { handleImagePerfil(e) }} />
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-3">
									<div className="card">
										<div className="card-header text-center">
											<span>Escudo</span>
										</div>
										<div className={`card-body ${cargandoImgEscudo === true ? ' skimg ' : ''}`}>
											<img
												alt={form.Nombre}
												className="card-img-top card-img-escudo"
												src={srcImagenEscudo}
												onLoad={() => setCargandoImgEscudo(false)}
												id="ImagenEscudoImg" />
										</div>
										<div className="card-footer">
											<h6>Sube una imagen</h6>
											<div className="form-group">
												<input type="file" className="form-control form-control-profile-img" name="ImagenEscudo" accept="image/*" id="ImagenEscudo"
													onChange={(e) => { handleImageEscudo(e) }} />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								{
									form.Id &&
									<button
										type="button"
										className="btn btn-primary btn-sm"
										disabled={form.Nombre === ''}
										onClick={() => {
											navigate("/cuerpotecnico", {
												state: {
													idEquipoActual: id,
													idCategoriaActual: form.IdCategoria
												}
											})
										}}>
										Cuerpo Técnico</button>
								}
								<button
									type="button"
									className="btn btn-primary btn-sm"
									disabled={form.Nombre === ''}
									onClick={postForm}>Confirmar</button>
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
			</div >
			<Loading contador={contadorLoading} />
		</>
	)
}