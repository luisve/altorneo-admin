import { MouseEvent, useEffect, useRef, useState } from "react"
import { toast } from 'react-toastify';


import { DefaultFechaType, FechaType } from "../../../types/fecha/FechaType";


import { postFixtureManualService } from "../../../services/torneo/TorneoFechaService";


import { FechaView, FixtureManualView, FixturePartidosView } from "../../../views/torneo/FixtureView";
import { EquipoView } from "../../../views/config/EquipoView";


type ModalProps = {
	listaEquipos: EquipoView[] | null,
	idTorneo: number | null,
	fetchFixture: () => void,
	close: () => void;
	isOpen: boolean;
	modalRef: React.RefObject<HTMLDivElement>;
}


export const TorneoFechasManualModal = ({
	listaEquipos
	, idTorneo
	, fetchFixture
	, close
	, isOpen
	, modalRef }: ModalProps) => {


	//const [listaEquiposView, setListaEquiposView] = useState<EquipoView[] | null>(listaEquipos.sort((a, b) => a.Nombre.localeCompare(b.Nombre)));
	const [listaEquiposView, setListaEquiposView] = useState<EquipoView[]>([]);
	const [proximoEquipo, setProximoEquipo] = useState<string>("local");
	const [partido, setPartido] = useState<FechaType>(DefaultFechaType);
	const [fixture, setFixture] = useState<FechaType[]>([]);
	const fechaNumeroRender = useRef<number>(0);
	const fechaNumeoRenderString = useRef<string>("");
	const fixtureCompleto = useRef<boolean>(false);
	const [idaYVuelta, setIdaYVuelta] = useState(false);


	useEffect(() => {
		if (isOpen) {
			setFixture([]);
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			if (listaEquipos) {
				setListaEquiposView(listaEquipos.sort((a, b) => a.Nombre.localeCompare(b.Nombre)));
			}
			if (listaEquipos) {
				const generarPartido = () => {
					let partidoActual = partido.Partido || 1;
					const nuevoPartido: FechaType = {
						IdLocal: partido.IdLocal || 0,
						IdVisitante: partido.IdVisitante || 0,
						FechaNumero: (partido.FechaNumero || 0) + 1,
						Partido: partidoActual,
						Local: listaEquipos.find(eq => eq.Id === Number(partido.IdLocal))?.Nombre || "",
						Visitante: listaEquipos.find(eq => eq.Id === Number(partido.IdVisitante))?.Nombre || "",
						Libre: "",
						ImagenLocal: "",
						ImagenVisitante: "",
						Zona: "",
					};
					setFixture(prevFixture => [...prevFixture, nuevoPartido]);
					setPartido({ ...partido, IdLocal: 0, IdVisitante: 0, Partido: partidoActual + 1, FechaNumero: partido.FechaNumero });
					setProximoEquipo("local");
				}
				if (partido.IdLocal !== 0 && partido.IdVisitante !== 0) {
					generarPartido();
				}
			}
		}
	}, [partido, listaEquipos, fixture, listaEquiposView, isOpen])


	const handleClicEquipo = (e: MouseEvent<HTMLLIElement>) => {
		if (proximoEquipo === "local") {
			setPartido({ ...partido, IdLocal: Number(e.currentTarget.id), });
		} else {
			setPartido({ ...partido, IdVisitante: Number(e.currentTarget.id), })
		}
		setProximoEquipo(proximoEquipo === "local" ? "visitante" : "local");
	}


	const handleDelPartido = (e: HTMLInputElement) => {
		let fixtureTemp = fixture.filter((_, index) => index !== Number(e.dataset.id));
		let partidoNumeroTemp = 0;
		fixtureTemp = fixtureTemp.map(partidoItem => {
			if (partidoItem.FechaNumero === (partido.FechaNumero || 0) + 1) {
				partidoNumeroTemp++;
				return { ...partidoItem, Partido: partidoNumeroTemp };
			} else {
				return partidoItem;
			}
		});
		setPartido({ ...partido, Partido: partidoNumeroTemp + 1 });
		setFixture(fixtureTemp);
	}


	// Busca si el equipo a listar no está ya asignado a un partido en la fecha actual 
	// o si ya se enfrentó con el local 
	const noDisponible = (idEquipo: number) => {
		const partidosDeLaFecha = fixture.filter((m) => m.FechaNumero === partido.FechaNumero! + 1);
		const yaJugoEnLaFecha = partidosDeLaFecha.some((m) => m.IdLocal === idEquipo || m.IdVisitante === idEquipo);
		if (proximoEquipo === "visitante") {
			const yaJugaron = fixture.some(
				(m) =>
					(m.IdLocal === partido.IdLocal && m.IdVisitante === idEquipo) ||
					(m.IdLocal === idEquipo && m.IdVisitante === partido.IdLocal)
			);
			return yaJugoEnLaFecha || yaJugaron || (partido.IdLocal === idEquipo);
		} else {
			return yaJugoEnLaFecha;
		}
	}


	if (!listaEquipos) {
		return null;
	}
	// Ver si ya estan asignados todos los equipos, de ser así significa
	// que cambia de fecha
	if (isOpen) {
		const partidosDeLaFecha = fixture.filter((m) => m.FechaNumero === partido.FechaNumero! + 1);
		const idsUsados = new Set(partidosDeLaFecha.flatMap(item => [item.IdLocal, item.IdVisitante]));
		const todosUsados = listaEquipos
			.filter(item => item.Id !== null && item.Id !== undefined)
			.every(item => idsUsados.has(item.Id!));
		if (todosUsados) {
			let fechas = listaEquipos.length - 1;
			const partidosPorFecha = listaEquipos.length / 2;
			fixtureCompleto.current = (fixture.length === (fechas * partidosPorFecha));
			if (partido.FechaNumero !== null) {
				setPartido({ ...partido, FechaNumero: partido.FechaNumero + 1, Partido: 0 });
				let nuevaFecha = partido.FechaNumero + 1;
				if (nuevaFecha > 0) {
					// extrae los partidos de la fecha anterior
					const partidosDeLaFecha = fixture.filter((m) => m.FechaNumero === nuevaFecha);
					let locales = listaEquipos.filter(item => partidosDeLaFecha.some((m) => m.IdVisitante === item.Id));
					locales.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
					let visitantes = listaEquipos.filter(item => !partidosDeLaFecha.some((m) => m.IdVisitante === item.Id));
					visitantes.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
					setListaEquiposView([...locales, ...visitantes]);
				}
			}
		}
	}


	const postFixture = async () => {
		if (idTorneo) {
			const fechaUnica = new Set();
			let fechas: FechaView[] = fixture.filter(partido => {
				if (fechaUnica.has(partido.FechaNumero)) return false;
				fechaUnica.add(partido.FechaNumero);
				return true;
			}).map(partido => ({
				IdTorneo: idTorneo,
				FechaNumero: partido.FechaNumero!,
				IdEquipoLibre: 0,
				Fase: 'GR'
			}));

			let listaPartidos: FixturePartidosView[] = fixture.map(partido => ({
				FechaNumero: partido.FechaNumero || 0,
				IdTorneo: idTorneo,
				Partido: partido.Partido || 0,
				IdLocal: partido.IdLocal || 0,
				IdVisitante: partido.IdVisitante || 0,
			}));

			if (idaYVuelta) {
				let fechaNumero = fechas.length;
				const fechasIV: FechaView[] = [
					...fechas,
					...fechas.map((fecha) => ({
						...fecha,
						FechaNumero: fecha.FechaNumero + fechaNumero,
					}))
				];
				fechas = fechasIV;

				const listaPartidosIV = [
					...listaPartidos,
					...listaPartidos.map((partido) => ({
						...partido,
						FechaNumero: partido.FechaNumero + fechaNumero,
						IdLocal: partido.IdVisitante,
						IdVisitante: partido.IdLocal,
					}))
				];
				listaPartidos = listaPartidosIV;
			}

			/** Se arma el json para subir */
			const jsonData: FixtureManualView = {
				idTorneo: idTorneo,
				fixture: listaPartidos,
				fechas: fechas,
				tipo: idaYVuelta ? "IV" : "I",
			};
			const ret = await postFixtureManualService(jsonData);
			if (ret.code === 200) {
				toast.success(ret.msg, { autoClose: 3000, });
				fetchFixture();
				close();
			}
		}
	}


	fechaNumeroRender.current = 0;


	return (
		<>
			<div className="modal fade" tabIndex={-1} ref={modalRef}>
				<div className="modal-dialog modal-xl">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="ModalLabel">Generar Fechas</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-3">
									{
										!fixtureCompleto.current ?
											<ul className="list-group">
												<li className="list-group-item fs-5"><strong>Equipos</strong></li>
												{
													listaEquiposView.map((equipo, index) => {
														if (equipo.Id) {
															if (noDisponible(equipo.Id)) {
																return null;
															} else {
																return (
																	<li
																		onClick={(e) => handleClicEquipo(e)}
																		className="list-group-item"
																		id={equipo.Id.toString()}
																		role="button"
																		key={index}>{equipo.Nombre}</li>

																)
															}
														}
													})
												}
											</ul>
											:
											<div className="row">
												<div className="col-md-12 text-center p-2">
													<span className="h4">Fixture Completo</span>
												</div>
												<div className="col-md-12 text-center p-2">
													<div style={{ alignItems: "center" }}>
														<span style={{ marginRight: "8px" }}>Ida y Vuelta</span>
														<input
															className="form-check-input"
															checked={idaYVuelta}
															onChange={(e) => { setIdaYVuelta(e.currentTarget.checked) }}
															title="Ida y vuelta"
															data-bs-original-title="Ida y vuelta"
															aria-label="Ida y vuelta"
															type="checkbox" />
													</div>
												</div>
												<div className="col-md-12 text-center p-2">
													<button
														onClick={() => postFixture()}
														type="button"
														className="btn btn-primary btn-sm">Confirmar</button>
												</div>
											</div>
									}
								</div>
								<div className="col-md-9">
									<ul className="list-group" style={{
										maxHeight: "75vh",
										overflowY: "auto",
									}}>
										{
											!fixtureCompleto.current &&
											<>
												<li className="list-group-item fs-5"><strong>Partido Actual</strong></li>
												<li className="list-group-item">
													<div className="row">
														<div className="col-md-6">
															{
																proximoEquipo === "local" ?
																	<span className="blink-animation">Local</span>
																	:
																	listaEquipos.find(eq => eq.Id === Number(partido.IdLocal))?.Nombre || ""
															}
														</div>
														<div className="col-md-6">
															{
																proximoEquipo === "visitante" ?
																	<span className="blink-animation">Visitante</span>
																	:
																	listaEquipos.find(eq => eq.Id === Number(partido.IdVisitante))?.Nombre || ""
															}
														</div>
													</div>
												</li>
											</>
										}
										<li className="list-group-item fs-5"><strong>Fechas</strong></li>
										{
											fixture.map((partidoFixture, index) => {
												fechaNumeoRenderString.current = "";
												if (partidoFixture.FechaNumero !== fechaNumeroRender.current) {
													fechaNumeroRender.current = partidoFixture.FechaNumero || 0;
													fechaNumeoRenderString.current = "Fecha: " + fechaNumeroRender.current;
												}
												return (
													<li
														className="list-group-item"
														role="button"
														key={index}>
														{
															fechaNumeoRenderString.current !== "" &&
															<p className="fs-6 text-center fw-bold">{fechaNumeoRenderString.current}</p>
														}
														<div className="row">
															<div className="col-md-1 fw-bold">{partidoFixture.Partido}</div>
															<div className="col-md-10">
																<div className="row">
																	<div className="col-md-5 fw-bold text-end">{partidoFixture.Local}</div>
																	<div className="col-md-2 fw-bold text-center">vs</div>
																	<div className="col-md-5 fw-bold">{partidoFixture.Visitante}</div>
																</div>
															</div>
															<div className="col-md-1">
																{
																	partido.FechaNumero !== null &&
																		partidoFixture.FechaNumero === partido.FechaNumero + 1 ?
																		<i
																			onClick={(e) => handleDelPartido(e.currentTarget as HTMLInputElement)}
																			role='button'
																			className="fa fa-trash"
																			data-id={index}></i>
																		:
																		<span className="material-icons-outlined link-edit"																		>
																			&nbsp;
																		</span>
																}
															</div>
														</div>
													</li>
												)
											})
										}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div >
		</>
	)
}

