import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


import { Loading } from '../../../components/Loading';
import { Fila, jsonJugadoresType, SheetData } from '../../../types/TypesType';
import { postJugadorJson } from '../../../services/config/JugadorService';
import { ApiResponseArray } from '../../../types/ApiResponseType';


type ModalProps = {
	xls: Fila[] | null;
	idEquipo: number;
	fetchJugadores: () => Promise<void>;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const JugadorXLSModal = ({
	xls,
	idEquipo,
	fetchJugadores,
	close,
	modalRef,
}: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);


	const [titulos, setTitulos] = useState<string[]>([]);
	const columnas = ["Altura", "Apellido", "Celular", "DNI", "Email", "FechaNacimiento", "Nombre", "Numero", "Peso", "Puesto", "Telefono"];
	const [data, setData] = useState<SheetData>([]);


	useEffect(() => {
		setTitulos([]);
		if (xls !== null) {
			setData(xls);
		}
	}, [xls]);


	// 🗑️ Eliminar fila
	const handleEliminarFila = (index: number) => {
		setData(prev => prev.filter((_, i) => i !== index));
	};


	// 🗑️ Eliminar columna
	const handleEliminarColumna = (clave: string, index: number) => {
		titulos.splice(index, 1);
		setData(prev =>
			prev.map(fila => {
				const nuevaFila = { ...fila };
				delete nuevaFila[clave];
				return nuevaFila;
			})
		);
	};


	const handleSelectChange = (columnIndex: number, newValue: string) => {
		let titulosTemp = titulos;

		titulosTemp = titulosTemp.map((item: string) => {
			return item === newValue ? "" : item; // vaciamos donde estaba repetido
		});
		titulosTemp[columnIndex] = newValue;
		setTitulos(titulosTemp);
	};


	const post = async () => {
		const hayUnaVacia = titulos.some(op => op === "" || op === null || op === undefined);
		if (hayUnaVacia) {
			toast.warning("Hay columnas que no tienen un campo asignado, debe asignar uno o eliminar la columna", { autoClose: 3000, });
			return;
		}
		if (titulos.length < 3) {
			toast.warning('Seleccione los títulos de las columnas, hay muy pocos seleccionados.', { autoClose: 3000, });
			return false;
		}
		/** Se arma el json para subir */
		//		debugger;
		let dataPost = data.map((item) => {
			const newItem: Record<string, string> = {};
			Object.keys(item).forEach((key, index) => {
				const newKey = titulos[index];
				if (newKey) {
					newItem[newKey] = item[key];
				}
			});
			return newItem;
		});
		setContadorLoading(1);
		const datosJson: jsonJugadoresType = {
			data: dataPost,
			idEquipo: idEquipo
		};
		const resp: ApiResponseArray<Fila> = await postJugadorJson(datosJson);
		if (resp.code === 200) {
			toast.success(resp.msg, { autoClose: 1000, });
			fetchJugadores();
			close();
		} else {
			toast.error(resp.msg, { autoClose: 3000, });
		}
		setContadorLoading(-1);
	};


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-xl" >
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Planilla de Jugadores</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body" style={{ height: '80vh', padding: 0 }}>
							<div style={{ height: '100%', overflowY: 'auto' }}>
								{
									data !== null && data.length > 0 &&

									<table className='table'>
										<thead>
											<tr>
												<th></th>
												{
													Object.keys(data[0] || {}).map((clave, index) => (
														<th key={index} className="text-nowrap text-center">
															<svg
																onClick={() => handleEliminarColumna(clave, index)}
																role="button"
																className="icon icon-trash"
																fill="currentColor"
																style={{ color: '#ff0000' }}>
																<use href="/admin/assets/fonts/fa/sprites/solid.svg#trash"></use>
															</svg>
														</th>
													))
												}
											</tr>
											<tr>
												<th></th>
												{
													Object.keys(data[0]).map((_, idx) => (
														<th key={idx}>
															<select
																className="form-select"
																value={titulos[idx] ? titulos[idx] : ""}
																onChange={(e) => handleSelectChange(idx, e.target.value)}>
																<option key={-1} value={""}>Seleccione</option>
																{
																	columnas.map((opcion, i) => (
																		<option
																			className={`key-${i}`}
																			key={i}
																			value={opcion}>
																			{opcion}
																		</option>
																	))
																}
															</select>
														</th>
													))
												}
											</tr>
										</thead>
										<tbody>
											{
												data.map((fila, index) => {
													const claves = Object.keys(fila);
													return (
														<tr
															key={index}>
															<td>
																<svg
																	onClick={() => handleEliminarFila(index)}
																	role="button"
																	className="icon icon-trash"
																	fill="currentColor"
																	style={{ color: '#ff0000' }}>
																	<use href="/admin/assets/fonts/fa/sprites/solid.svg#trash"></use>
																</svg>
															</td>
															{
																claves.map((clave, idx) => (
																	<td className="text-nowrap" key={idx}>{fila[clave]}</td>
																))
															}
														</tr>
													);
												})
											}
										</tbody>
									</table>
								}
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								onClick={() => post()}
								className="btn btn-primary btn-sm">Confirmar</button>
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								aria-label="Cerrar"
								onClick={close}>Cerrar</button>
						</div>
					</div>
				</div>
			</div>
			<Loading contador={contadorLoading} />
		</>
	)
}
