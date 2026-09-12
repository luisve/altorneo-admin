import { useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


import { Loading } from '../../components/Loading';


import { CambioPasswordType, DefaultCambioPasswordType } from '../../types/CambioPasswordType';
import { postCambioPassword } from '../../services/PerfilService';


interface ModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
}


export const CambioPasswordModal: React.FC<ModalProps> = ({ modalRef }) => {



	const navigate = useNavigate();



	const [contadorLoading, setContadorLoading] = useState(0);
	const [form, setForm] = useState<CambioPasswordType>(DefaultCambioPasswordType);



	const formChange = (data: Record<string, any>) => {
		Object.keys(data).forEach((key) => {
			setForm(prev => ({
				...prev,
				[key]: data[key]
			}));
		});
	};


	const postForm = async () => {
		if (form.PasswordNueva === form.PasswordNueva2 && form.PasswordNueva !== "" && form.PasswordActual !== "") {
			setContadorLoading(1);
			const r = await postCambioPassword(form);
			if (r.msg === "ok") {
				toast.success("Los datos se guardaron correctamente", { autoClose: 1000, });
				setTimeout(() => {
					navigate('/login/');
					close;
				}, 1000);
			} else {
				toast.error(r.msg, { autoClose: 3000 });
			}
			setContadorLoading(-1);
		} else {
			toast.warning("Revise los datos ingresados.", { autoClose: 3000, });
		}
	}



	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-sm">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Cambio de Password</h5>
							<button
								onClick={close}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Cerrar"></button>
						</div>
						<div className="modal-body">
							<div className="container">
								<form className="form-theme">
									<div className="form-group">
										<label htmlFor="passwordActual">Password Actual</label>
										<input
											autoFocus={true}
											value={form.PasswordActual}
											onChange={(e) => formChange({"PasswordActual": e.target.value})}
											type="password"
											id="passwordActual"
											className="form-control"
											placeholder="Password Actual"/>
									</div>
									<div className="form-group">
										<label htmlFor="passwordNueva">Password Nueva</label>
										<input
											value={form.PasswordNueva}
											onChange={(e) => formChange({"PasswordNueva": e.target.value})}
											type="password"
											id="passwordNueva"
											className="form-control"
											placeholder="Password Nueva"/>
									</div>
									<div className="form-group">
										<label htmlFor="passwordNueva2">Password Nueva</label>
										<input
											value={form.PasswordNueva2}
											onChange={(e) => formChange({"PasswordNueva2": e.target.value})}
											type="password"
											id="passwordNueva2"
											className="form-control"
											placeholder="Password Nueva"/>
									</div>
								</form>
							</div>
						</div>
						<div className="modal-footer">
							<button
								onClick={postForm}
								type="button"
								className="btn btn-primary btn-guardar">Guardar
							</button>
							<button
								onClick={close}
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
								aria-label="Close">Cerrar
							</button>
						</div>

					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	)
}
