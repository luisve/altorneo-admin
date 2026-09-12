import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "bootstrap";
import { toast } from 'react-toastify';


import { URL_IMAGES, URLROOT } from '../../utils/constants';
import { Loading } from '../../components/Loading';


import { CampeonatoType, DefaultCampeonatoType } from '../../types/CampeonatoType';
import { SelectType } from '../../types/SelectType';


import { getDatos, postPerfilDatos, postPerfilLogo } from "../../services/PerfilService";
import { getCiudadSelectService, getPaisSelectService } from '../../services/SelectService';


interface ModalProps {
	modalRef: React.RefObject<HTMLDivElement>;
}


export const DatosModal: React.FC<ModalProps> = ({ modalRef }) => {


	const [contadorLoading, setContadorLoading] = useState<number>(0);
	const [form, setForm] = useState<CampeonatoType>(DefaultCampeonatoType);
	const [listaPaises, setListaPaises] = useState<SelectType[]>([]);
	const [listaCiudades, setListaCiudades] = useState<SelectType[]>([]);
	const [idPais, setIdPais] = useState<number>(0);


	const [activeTab, setActiveTab] = useState(0);
	const tabs = ['Datos', 'Logo del Campeonato'];
	const [srcImagenLogo, setSrcImagenLogo] = useState(URL_IMAGES + 'svg/escudo.svg');

	const close = () => {
		if (modalRef.current) {
			const modal = Modal.getInstance(modalRef.current);
			modal?.hide();
		}
	};

	useEffect(() => {
		if (!modalRef.current) return;
		const el = modalRef.current;
		const handleShown = () => {
			// Modal abierto
			const fetchPaisList = async () => {
				const paisList = await getPaisSelectService();
				setListaPaises(paisList);
				fetchDatos();
			};
			setContadorLoading(1);
			fetchPaisList();
			setContadorLoading(-1);
		};
		el.addEventListener("shown.bs.modal", handleShown);
		return () => {
			el.removeEventListener("shown.bs.modal", handleShown);
		};
	}, [modalRef]);


	const formChange = (data: Record<string, any>) => {
		Object.keys(data).forEach((key) => {
			setForm(prev => ({
				...prev,
				[key]: data[key]
			}));
		});
	};


	const postLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("ImagenLogo", file);
		const resp = await postPerfilLogo(formData);
		if (resp.code !== 200) {
			fetchDatos();
			toast.error(resp.msg);
			close();
		} else {
			toast.success(resp.msg, { autoClose: 1000 });
		}
	};


	useEffect(() => {
		if (idPais > 0) {
			const getCiudades = async () => {
				setContadorLoading(1);
				const lista = await getCiudadSelectService(idPais);
				setListaCiudades(lista);
				setContadorLoading(-1);
			};
			getCiudades();
		}
	}, [idPais]);


	const fetchDatos = useCallback(async () => {
		setContadorLoading(1);
		const datos = await getDatos();
		setForm(datos);
		if (datos.ImagenLogo !== "") {
			setSrcImagenLogo(URLROOT + datos.ImagenLogo);
		} else {
			setSrcImagenLogo(URL_IMAGES + 'svg/escudo.svg');
		}
		setIdPais(datos.IdPais);
		setContadorLoading(-1);
	}, []);

	/*
		useEffect(() => {
			const fetchPaisList = async () => {
				const paisList = await getPaisSelectService();
				setListaPaises(paisList);
				fetchDatos();
			};
			fetchPaisList();
		}, [fetchDatos])
	*/

	const postForm = async () => {
		if (form.Nombre === "") {
			toast.warning('Debe al menos asignarle un nombre al administrador.', { autoClose: 3000, });
			return;
		};
		const formData = new FormData();
		Object.entries(form).forEach(([key, value]) => {
			if (key !== "NombreUrl" && key !== "Nombre") {
				formData.append(key, value);
			}
		});
		setContadorLoading(1);
		const resp = await postPerfilDatos(formData);
		if (resp.msg === "ok") {
			fetchDatos();
			toast.success("Los datos se guardaron correctamente", { autoClose: 1000, });
			close();
		} else {
			toast.error(resp.msg, { autoClose: 3000, });
		}
		setContadorLoading(-1);
	}


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos del usuario</h5>
							<button
								onClick={close}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Cerrar"
							></button>
						</div>
						<div className="modal-body">
							<ul className="nav nav-tabs">
								{
									tabs.map((tab, index) => (
										<li
											className="nav-item"
											key={index}>
											<a
												className={`nav-link ${activeTab === index ? 'active' : ''}`}
												id="tab0"
												data-bs-toggle="tab"
												href="#"
												role="tab"
												aria-controls={tab}
												aria-selected={activeTab === 0}
												onClick={() => setActiveTab(index)}>
												{tab}
											</a>
										</li>
									))
								}
							</ul>
							<div className="container">
								{
									activeTab === 0 &&
									<form className="form-theme" action="" id="formRegistro">
										<div className="row">
											<div className="col-md-6">
												<div className="row justify-content-md-center">
													<h4>Datos del Campeonato</h4>
													<div className="form-group">
														<label htmlFor="NombreUrl">Nombre del campeonato *</label>
														<input
															value={form.Nombre}
															disabled
															type="text"
															id="Nombre"
															className="form-control"
															placeholder="Nombre del campeonato" />
														<input value={form.NombreUrl} type="hidden" />
													</div>
													<div className="form-group">
														<label htmlFor="IdPais">País *</label>
														<select
															value={idPais}
															onChange={(e) => setIdPais(Number(e.target.value))}
															id="IdPais"
															name="IdPais"
															className="form-select">
															{listaPaises.length > 0 &&
																listaPaises.map((pais, index) => {
																	return (
																		<option key={index} value={pais.Id}>
																			{pais.Label}
																		</option>
																	);
																})}
														</select>
													</div>
													<div className="form-group">
														<label htmlFor="IdCiudad">Ciudad</label>
														<select
															value={form.IdCiudad}
															onChange={(e) => formChange({ "IdCiudad": Number(e.target.value) })}
															id="IdCiudad"
															className="form-select">
															{listaCiudades.length > 0 &&
																listaCiudades.map((ciudad, index) => {
																	return (
																		<option key={index} value={ciudad.Id}>
																			{ciudad.Label}
																		</option>
																	);
																})}
														</select>
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="row justify-content-md-center">
													<h4>Datos del Administrador</h4>
													<div className="form-group">
														<label htmlFor="nombreadmin">
															Nombre del Admin *
														</label>
														<input
															value={form.NombreAdmin}
															onChange={(e) => formChange({ "NombreAdmin": e.target.value })}
															type="text"
															className="form-control"
															id="nombreadmin"
															placeholder="Escriba su nombre"
														/>
													</div>
													<div className="form-group">
														<label htmlFor="Mail">Mail *</label>
														<input
															value={form.Mail}
															onChange={(e) => formChange({ "Mail": e.target.value })}
															type="email"
															className="form-control"
															id="Mail"
															pattern="[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}"
														/>
													</div>
													<div className="form-group">
														<label htmlFor="Domicilio">Domicilio</label>
														<input
															value={form.Domicilio}
															onChange={(e) => formChange({ "Domicilio": e.target.value })}
															type="text"
															className="form-control"
															id="Domicilio"
														/>
													</div>
													<div className="form-group">
														<label htmlFor="Telefono"> Tel / Celular </label>
														<input
															value={form.Telefono}
															onChange={(e) => formChange({ "Telefono": e.target.value })}
															type="number"
															id="Telefono"
															className="form-control" />
													</div>
												</div>
											</div>
										</div>
									</form>
								}
								{
									activeTab === 1 &&
									<>
										<div className="text-center">
											{
												contadorLoading > 0
													?
													<div className='skimg'></div>
													:
													<img style={{ maxHeight: "50vh", overflowY: "auto" }}
														alt={form.Nombre}
														className="mw-100 h-100"
														src={srcImagenLogo}
														id="ImagenLogo" />
											}
										</div>
										<div className="">
											<h6>Sube una imagen</h6>
											<div className="form-group">
												<input type="file" className="form-control form-control-profile-img" name="ImagenEscudo" accept="image/*" id="ImagenEscudo"
													onChange={(e) => { postLogo(e) }} />
											</div>
										</div>
									</>
								}
							</div>
						</div>
						{
							activeTab === 0 &&
							<div className="modal-footer">
								<button
									onClick={postForm}
									type="button"
									className="btn btn-primary btn-guardar">
									Guardar
								</button>
								<button
									onClick={close}
									type="button"
									className="btn btn-secondary"
									data-bs-dismiss="modal"
									aria-label="Close">
									Cerrar
								</button>
								<div></div>
							</div>
						}
					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	);
};
