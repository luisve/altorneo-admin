import { useState } from 'react'
import { toast } from 'react-toastify';


import { Loading } from '../../../components/Loading';
import { postGenerarFixtureService } from '../../../services/torneo/TorneoFechaService';


type ModalProps = {
	idTorneo: number | null;
	fetchFixture: () => void;
	cantidadEquipos: number;
	close: () => void;
	modalRef: React.RefObject<HTMLDivElement>;
};


export const TorneoFechasModal = ({
	idTorneo,
	fetchFixture,
	cantidadEquipos,
	close,
	modalRef,
}: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);


	const [modo, setModo] = useState("I");
	const [zonas, setZonas] = useState<number>(1);
	const [continuaEn, setContinuaEn] = useState<string>("");


	const onGenerar = async () => {
		setContadorLoading(1);
		const jsonData = {
			IdTorneo: idTorneo,
			Modo: modo,
			Zonas: zonas,
			ContinuaEn: continuaEn,
		}
		const ret = await postGenerarFixtureService(jsonData);
		if (ret.code === 200) {
			fetchFixture();
			toast.success(ret.msg, { autoClose: 3000, });
			close();
		}
		setContadorLoading(-1);
	}


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="ModalLabel">Generar Fechas</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<span className='text-center'>
								<h6>Todos Contra Todos</h6>
							</span>
							<div className="input-group text-center">
								<div id="radioBtn" className="btn-group mx-auto my-2">
									<button
										className={`btn btn-sm ${modo === "I" ? ' btn-info ' : ' btn-outline-info '}`}
										data-toggle="modo"
										onClick={() => setModo("I")}
										data-value="I">IDA</button>
									<button
										className={`btn btn-sm ${modo === "IV" ? ' btn-info ' : ' btn-outline-info '}`}
										data-toggle="modo"
										onClick={() => setModo("IV")}
										data-value="IV">IDA Y VUELTA
									</button>
								</div>
							</div>
							{
								<div className='my-2 d-none'>
									<div className='text-center h6'>Zonas</div>
									<div className="row justify-content-md-center ">
										<div className="col-6">
											<select
												value={zonas}
												onChange={(e) => setZonas(Number(e.target.value))}
												className="form-select"
												id="Zonas"
												name="Zonas">
												<option value={1} className='text-center' >Unica</option>
												<option value={2} className={`${(cantidadEquipos / 4) >= 2 ? 'text-center' : 'd-none'}`} >2</option>
												<option value={4} className={`${(cantidadEquipos / 4) >= 4 ? 'text-center' : 'd-none'}`} >4</option>
												<option value={8} className={`${(cantidadEquipos / 4) >= 8 ? 'text-center' : 'd-none'}`} >8</option>
												<option value={16} className={`${(cantidadEquipos / 4) >= 16 ? 'text-center' : 'd-none'}`}>16</option>
											</select >
										</div>
									</div>
								</div>
							}
							{
								zonas > 1 &&
								<div className='my-2 d-none'>
									<div className='text-center h6'>Continúa en</div>
									<div className="row justify-content-md-center ">
										<div className="col-6">
											<select
												value={continuaEn}
												onChange={(e) => setContinuaEn(e.target.value)}
												className="form-select"
												id="ContinuaEn"
												name="ContinuaEn">
												<option value={'CU'} className={`${zonas > 4 ? 'text-center' : 'd-none'}`}>Cuartos</option>
												<option value={'SE'} className={`${zonas > 2 ? 'text-center' : 'd-none'}`} >Semi Final</option>
												<option value={'FI'} className={`${zonas > 1 ? 'text-center' : 'd-none'}`} >Final</option>
											</select >
										</div>
									</div>
								</div>
							}
							<div className="col-sm-4 mx-auto py-3 text-center">
								<button
									onClick={() => onGenerar()}
									type="button"
									className="btn btn-primary btn-sm">Generar</button>
							</div>
							<div className="tablaFechas"></div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								data-bs-dismiss="modal"
								onClick={close}
								aria-label="Cerrar">Cerrar</button>
						</div>
					</div>
				</div>
			</div >
			<Loading contador={contadorLoading} />
		</>
	)
}
