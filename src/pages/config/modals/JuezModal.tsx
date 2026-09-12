import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';


import { Loading } from '../../../components/Loading';
import { DefaultJuezType, JuezType } from '../../../types/config/JuezType';
import { getJuezService, postJuezService } from '../../../services/config/JuezService';


type ModalProps = {
	id: number | null;
	fetchJueces: () => Promise<void>;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const JuezModal = ({
	id,
	fetchJueces,
	close,
	modalRef }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);

	const [form, setForm] = useState<JuezType>(DefaultJuezType);


	useEffect(() => {
		const fetchJuez = (async (id: number) => {
			setContadorLoading(1);
			setForm(await getJuezService(id));
			setContadorLoading(-1);
		});
		if (id) {
			fetchJuez(id);
		} else {
			setForm(DefaultJuezType);
		}
	}, [id]);


	const postForm = async () => {
		if (form.ApellidoYNombre === "") {
			toast.warning('Debe al menos asignarle un Nombre y Apellido al juez.', { autoClose: 3000, });
			return;
		};
		setContadorLoading(1);
		const resp = await postJuezService(form);
		setContadorLoading(-1);
		if (resp.code === 200) {
			toast.success(resp.msg);
			fetchJueces();
			close();
		}
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos del Juez</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className='modal-body'>
							<div className='row'>
								<div className="col">
									<form className="form form-horizontal form-theme" >
										<fieldset>
											<div className='row'>
												<label htmlFor='ApellidoYNombre' className='col-md-4 control-label'>Apellido y Nombre</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className='form-control'
														id="ApellidoYNombre"
														name="ApellidoYNombre"
														value={form.ApellidoYNombre}
														onChange={(e) => setForm(prev => ({ ...prev, "ApellidoYNombre": e.target.value }))}
														placeholder="Apellido y Nombre" />
												</div>
											</div>
											<div className='row'>
												<label htmlFor='Mail' className="col-md-4 control-label">Mail</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className='form-control'
														id="Mail"
														name="Mail"
														value={form.Mail}
														onChange={(e) => setForm(prev => ({ ...prev, "Mail": e.target.value }))}
														placeholder="Mail" />
												</div>
											</div>
											<div className='row'>
												<label htmlFor='Telefono' className="col-md-4 control-label">Teléfono</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className='form-control'
														id="Telefono"
														name="Telefono"
														value={form.Telefono}
														onChange={(e) => setForm(prev => ({ ...prev, "Telefono": e.target.value }))}
														placeholder="Teléfono" />
												</div>
											</div>
											<div className='row'>
												<label htmlFor='Celular' className="col-md-4 control-label">Celular</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<input
														type="text"
														className="form-control"
														id="Celular"
														name="Celular"
														value={form.Celular}
														onChange={(e) => setForm(prev => ({ ...prev, "Celular": e.target.value }))}
														placeholder="Celular" />
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
														value={form.Domicilio}
														onChange={(e) => setForm(prev => ({ ...prev, "Domicilio": e.target.value }))}
														placeholder="Domicilio" />
												</div>
											</div>
											<div className="row">
												<label htmlFor="Observaciones" className="col-md-4 control-label">Observaciones</label>
												<div className={`col-md-8 ${form.Id === -1 ? 'line' : ''}`}>
													<textarea
														className="form-control"
														id="Observaciones"
														name="Observaciones"
														value={form.Observaciones}
														onChange={(e) => setForm(prev => ({ ...prev, "Observaciones": e.target.value }))}
														placeholder="Observaciones" ></textarea>
												</div>
											</div>
										</fieldset>
									</form>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								onClick={postForm}
								disabled={form.ApellidoYNombre === ''}
								className="btn btn-primary btn-confirmar btn-sm">Confirmar</button>
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								onClick={close}
								aria-label="Close">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	)
}
