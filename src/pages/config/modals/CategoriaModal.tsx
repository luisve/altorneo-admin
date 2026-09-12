import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify';


import { Loading } from '../../../components/Loading';


import { getCagetoriaService, postCategoriaService } from '../../../services/config/CategoriaService';
import { CategoriaType, DefaultCategoriaType } from '../../../types/config/CategoriaType';


type ModalProps = {
	id: number | null;
	fetchCategorias: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
	close: () => void;
};


export const CategoriaModal = ({ id, fetchCategorias, modalRef, close }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);
	const [form, setForm] = useState<CategoriaType>(DefaultCategoriaType);


	const fetchCategoria = useCallback(async (id: number) => {
		setContadorLoading(1);
		setForm(await getCagetoriaService(id));
		setContadorLoading(-1);
	}, [id]);


	useEffect(() => {
		if (id) {
			fetchCategoria(id);
		} else {
			setForm(DefaultCategoriaType);
		}
	}, [fetchCategoria, id]);


	const postForm = async () => {
		if (form.Nombre === "") {
			toast.warning('No se le ha asignado un nombre a la categoría.', { autoClose: 3000 });
			return;
		}
		setContadorLoading(1);
		const data = await postCategoriaService(form);
		setContadorLoading(-1);
		if (data.code === 200) {
			toast.success(data.msg);
			fetchCategorias();
			close();
		} else {
			toast.error(data.msg, { autoClose: 3000, });
		}
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Datos de la Categoria</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col">
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
										</fieldset>
									</form>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								onClick={postForm}
								disabled={form.Nombre === ''}
								className="btn btn-primary btn-sm">Confirmar</button>
							<button
								type="button"
								data-bs-dismiss="modal"
								aria-label="Close"
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
