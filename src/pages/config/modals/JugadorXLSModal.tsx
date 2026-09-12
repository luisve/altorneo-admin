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
		//console.log(titulosTemp);
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
		//const resp: ResponseType = await postJugadorXLSService(dataPost);
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
															<i
																role="button"
																className="fa fa-trash"
																onClick={() => handleEliminarColumna(clave, index)}
																style={{ color: 'red' }}
															></i>
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
																<i
																	role="button"
																	className="fa fa-trash"
																	onClick={() => handleEliminarFila(index)}
																	style={{ color: 'red' }}
																></i>
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


/**
const resultadoFinal = getConvertedData();
console.log(resultadoFinal);

[
  { nombre: "Juan", telefono: "123456", email: "juan@mail.com" },
  { nombre: "Ana", telefono: "789012", email: "ana@mail.com" }
]

<table>
  <thead>
	<tr>
	  <th></th>
	  {Object.keys(columnas).map((colKey) => (
		<th key={colKey} onClick={() => handleDeleteColumn(colKey)}>
		  {columnas[colKey]}
		</th>
	  ))}
	</tr>
  </thead>
  <tbody>
	{data.map((row, rowIndex) => (
	  <tr key={rowIndex}>
		<td onClick={() => handleDeleteRow(rowIndex)}>🗑️</td>
		{Object.keys(columnas).map((colKey) => (
		  <td key={colKey}>{row[colKey]}</td>
		))}
	  </tr>
	))}
  </tbody>
</table>
 
 */









/**
 * 
 * 
 * 											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="A"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select1" data-i={0}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="B"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select2" data-i={1}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="C"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select3" data-i={2}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="D"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select4" data-i={3}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="E"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select5" data-i={4}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="F"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select6" data-i={5}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="G"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select7" data-i={6}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="H"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select8" data-i={7}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="I"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select9" data-i={8}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="J"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select10" data-i={9}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>
											<th className='text-center'>
												<span
													className="material-icons-outlined linkDeleteFila"
													data-col="K"
													onClick={(e) =>handleClicDeleteColumna(e.target)}
													tooltip="Eliminar Columna"
													title="Eliminar Columna">delete</span>
												<select className='form-select' name="select11" data-i={10}>{selectJugador.current.map((op, i) => { return (<option key={i}>{op}</option>) })}</select></th>






















														<td className="text-nowrap">{reg.A}</td>
														<td className="text-nowrap">{reg.B}</td>
														<td className="text-nowrap">{reg.C}</td>
														<td className="text-nowrap">{reg.D}</td>
														<td className="text-nowrap">{reg.E}</td>
														<td className="text-nowrap">{reg.F}</td>
														<td className="text-nowrap">{reg.G}</td>
														<td className="text-nowrap">{reg.H}</td>
														<td className="text-nowrap">{reg.I}</td>
														<td className="text-nowrap">{reg.J}</td>
														<td className="text-nowrap">{reg.K}</td>

												* 
 * 
 */