import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


import { Menu } from '../../components/Menu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Loading } from '../../components/Loading';


import { SelectType } from '../../types/SelectType';
import { DefaultTorneoDatosType, TorneoDatosType } from '../../types/torneo/torneoDatosType';


import { getTorneosCreadosSelectService } from '../../services/SelectService';
import { getTorneoDatosService, postTorneoIniciarService } from '../../services/torneo/TorneoIniciarService';


export const TorneoIniciar = () => {


	const [contadorLoading, setContadorLoading] = useState(0);


	const [listaTorneos, setListaTorneos] = useState<SelectType[] | null>(null);
	const [idTorneo, setIdTorneo] = useState<number>(0);


	const [torneo, setTorneo] = useState<TorneoDatosType>(DefaultTorneoDatosType);


	useEffect(() => {
		if (idTorneo !== 0) {
			const fetchTorneoDatos = async () => {
				const torneo = await getTorneoDatosService(idTorneo);
				setTorneo(torneo);
			};
			fetchTorneoDatos();
		}
	}, [idTorneo])


	const handleChangeTorneo = (idTorneo: number) => {
		setIdTorneo(idTorneo);
	}


	const fetchTorneos = async () => {
		const torneoList = await getTorneosCreadosSelectService();
		setListaTorneos(torneoList);
		setIdTorneo(torneoList.length > 0 ? torneoList[0].Id : 0);
	};


	useEffect(() => {
		fetchTorneos();
	}, []);


	const post = async () => {
		setContadorLoading(1);
		const jsonData = {
			IdTorneo: idTorneo,
			cantidadJugadores: torneo.cantidadJugadores,
			cantidadEquipos: torneo.cantidadEquipos,
		}
		const ret = await postTorneoIniciarService(jsonData);
		if (ret.code === 200) {
			toast.success(ret.msg, { autoClose: 1000 });
			setListaTorneos(null);
			fetchTorneos();
		}
		setContadorLoading(-1);
	};


	return (
		<>
			<Menu />
			<section className="container">
				<div className="panel-box padding-b">
					<Breadcrumb seccion="torneo iniciar" />
					<div className="titles">
						<div className="row">
							<div className="col-8">
								<h4>Iniciar Torneo</h4>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row my-2">
							{
								listaTorneos !== null &&
									listaTorneos.length > 0 ?
									<div className="col-md-6">
										<label htmlFor="IdEquipo">Torneos</label>
										<select
											className="form-select form-select-sm"
											onChange={(e) => { handleChangeTorneo(Number(e.target.value)); }}
											value={idTorneo}
											id="IdEquipo"
											name="IdEquipo"
											aria-label='Listado de equipos'>
											{
												listaTorneos.map((torneo, index) => {
													return (
														<option value={torneo.Id} key={index} >{torneo.Label}</option>
													)
												})
											}
										</select>
									</div>
									:
									<div className="card shadow-sm">
										<div className="card-body text-center py-5">
											<h5 className="fw-bold">
												No hay torneos creados para iniciar.
											</h5>
										</div>
									</div>
							}
						</div>
						{
							listaTorneos !== null ?
								listaTorneos.length > 0 &&
								<div className="d-flex justify-content-center">
									<div className="card">
										<div className="card-body">
											<h5 className="card-title">Datos del torneo</h5>
											<ul className="list-group">
												<li className="list-group-item row">
													<h6 className="col-md-4 float-start">Nombre:</h6>
													<h6 className="col-md-8 fw-bold">{torneo.torneo.Nombre}</h6>
												</li>
												<li className='list-group-item row'>
													<h6 className="col-md-4 float-start">Fecha Inicio:</h6>
													<h6 className="col-md-8 fw-bold">{torneo.torneo.FechaInicio.toString()}</h6>
												</li>
												<li className='list-group-item row'>
													<h6 className="col-md-4 float-start">Jugadores por equipo:</h6>
													<h6 className="col-md-8 fw-bold">{torneo.torneo.Jugadores}</h6>
												</li>
												<li className='list-group-item row'>
													<div className="row">
														<div className="col-md-12">
															<h6 className="fw-bold">Puntos:</h6>
														</div>
													</div>
													<div className="row">
														<div className="col-md-4">
															<h6 className="float-start">Partido Ganado:</h6>
														</div>
														<div className="col-md-8">
															<h6 className="fw-bold">{torneo.torneo.PuntosGanado}</h6>
														</div>
													</div>
													<div className="row">
														<div className="col-md-4">
															<h6 className="float-start">Partido Empatado:</h6>
														</div>
														<div className="col-md-8">
															<h6 className="fw-bold">{torneo.torneo.PuntosEmpatado}</h6>
														</div>
													</div>
													<div className="row">
														<div className="col-md-4">
															<h6 className="float-start">Partido Perdido:</h6>
														</div>
														<div className="col-md-8">
															<h6 className="fw-bold">{torneo.torneo.PuntosPerdido}</h6>
														</div>
													</div>
												</li>
												<li className='list-group-item row'>
													<h6 className="col-md-4 float-start">Cantidad Equipos:</h6>
													<h6 className="col-md-8 fw-bold">{torneo.cantidadEquipos}</h6>
												</li>
												<li className='list-group-item row'>
													<h6 className="col-md-4 float-start">Cantidad Jugadores:</h6>
													<h6 className="col-md-8 fw-bold">{torneo.cantidadJugadores}</h6>
												</li>
											</ul>
										</div>
										<div className="card-footer bg-transparent">
											<div className="row grupo-btn-iniciar">
												{(torneo.fechas !== 0 && torneo.cantidadEquipos !== 0) &&
													<div className="col-md-12">
														<div className="alert alert-info" role="alert">
															Tenga en cuenta que al iniciar el torneo ya no se podrán modificar las fechas, equipos ni jugadores.
														</div>
													</div>
												}
												{Number(torneo.fechas) < 1 &&
													<div className="col-md-12">
														<div className="alert alert-warning" role="alert">
															No se ha generado el fixture del torneo, debe ir antes al menú Torneo - Fechas
														</div>
													</div>
												}
												{torneo.cantidadEquipos === 0 &&
													<div className="col-md-12">
														<div className="alert alert-warning" role="alert">
															No hay equipos habilitados para jugar el torneo. Se deben habilitar desde el menú Torneo - Equipos
														</div>
													</div>
												}
												<div className="col-md-12">
													<div className="d-flex flex-row-reverse">
														<button
															disabled={!((Number(torneo.fechas) > 0) && (Number(torneo.cantidadEquipos) > 0))}
															onClick={() => { post() }}
															type="button"
															className="btn btn-primary m-2">Iniciar</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								:
								<table className='sk'>
									<tbody>
										<tr ><td className='line'></td></tr>
									</tbody>
								</table>
						}
					</div>
				</div>
			</section>
			<Loading contador={contadorLoading} />
		</>
	)
}

export default TorneoIniciar;