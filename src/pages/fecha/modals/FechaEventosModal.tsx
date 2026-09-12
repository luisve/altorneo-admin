import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'react-toastify';


import { Loading } from '../../../components/Loading';
import Autocomplete, { AutocompleteRef } from '../../../components/Autocomplete';
import { GrillaEventos } from '../../../components/GrillaEventos';


import { EventoType, DefaultEventoType, postEventoType } from '../../../types/partido/EventoType';
//import { JugadorType } from '../../../types/config/JugadorType';


import { PartidoPrintView } from '../../../views/partido/PartidoPrintView';
import { SelectType } from '../../../types/SelectType';


import { getJugadoresXTorneoEquipoService } from '../../../services/torneo/TorneoJugadorService';
import { getEventoListaService, postEventoService } from '../../../services/partido/EventoService';
import { TorneoEquipoJugadorType } from '../../../types/torneo/TorneoEquipoJugadoresType';


type ModalProps = {
	show: boolean;
	onShow: (valor: boolean) => void;
	partido: PartidoPrintView;
	idTorneo: number;
};


type ListaJugadoresType = {
	Id: number,
	Jugadores: TorneoEquipoJugadorType[],
}


export const FechaEventosModal = ({ show, onShow, partido, idTorneo }: ModalProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);

	const [idEquipo, setIdEquipo] = useState(0);
	const [listaEquipos, setListaEquipos] = useState<SelectType[]>([]);
	const listaJugadoresLocalStorage = useRef<ListaJugadoresType[]>([]);
	const [listaEventos, setListaEventos] = useState<EventoType[]>([]);
	const listaJugadoresSelect = useRef<SelectType[]>([]);
	const listaJugadoresIngresoSelect = useRef<SelectType[]>([]);
	const [form, setForm] = useState<EventoType>(DefaultEventoType);
	const autocompleteRef = useRef<AutocompleteRef>(null);
	const autocompleteRefJugadorCambio = useRef<AutocompleteRef>(null);


	function devolverNombreJugador(
		idEquipo: number,
		id: number
	): string | "" {
		const jugadores = listaJugadoresLocalStorage.current.find(equipo => equipo.Id === idEquipo)?.Jugadores;
		if (!jugadores) return "";

		const jugador = jugadores.find(jugador => jugador.IdJugador === id);
		return jugador ? jugador.Apellido + ' ' + jugador.Nombre : "";
	}


	const post = () => {
		const data: postEventoType = { IdPartido: partido.Id || 0, Eventos: listaEventos };
		// console.log(data);
		// return;
		postEventoService(data)
			.then(resp => {
				toast.success(resp.msg, { autoClose: 1000, });
				onShow(false);
			});
	}


	const handleSelectJugador = (selected: SelectType) => {
		setForm(prev => ({ ...prev, IdJugador: selected.Id, NombreJugador: selected.Label }))
		listaJugadoresIngresoSelect.current = listaJugadoresSelect.current.filter(jugador => jugador.Id !== selected.Id);
	};


	const handleChangeEquipo = (idEquipo: number) => {
		// Se extra la lista de jugadores para el autocomplete
		let lista = listaJugadoresLocalStorage.current.filter(equipo => equipo.Id === idEquipo)[0];
		let listaAutocomplete: SelectType[] = [];
		lista.Jugadores.forEach(reg => {
			listaAutocomplete.push({ Id: reg.IdJugador, Label: reg.Apellido + " " + reg.Nombre });
		})
		listaJugadoresSelect.current = listaAutocomplete;
		setIdEquipo(idEquipo);
		setForm(prev => ({ ...prev, IdEquipo: idEquipo }));
	};


	function handleClose() {
		onShow(false);
	}


	const getEventosDesdeAPI = useCallback(() => {
		setContadorLoading(1);
		getEventoListaService(partido.Id || 0)
			.then((lista) => {
				const resultado = lista.map(evento => {
					const nombreJugador = devolverNombreJugador(evento.IdEquipo, evento.IdJugador);
					const nombreJugadorIngreso = devolverNombreJugador(evento.IdEquipo, evento.IdJugadorIngreso);
					return { ...evento, NombreJugador: nombreJugador, NombreJugadorIngreso: nombreJugadorIngreso };
				});
				setListaEventos(resultado);
				setContadorLoading(-1);
			});

		let Equipos = [{ "Id": partido.IdLocal, "Label": "Local - " + partido.EquipoLocal }];
		Equipos.push({ "Id": partido.IdVisitante, "Label": "Visitante - " + partido.EquipoVisitante });
		setListaEquipos([
			{ Id: partido.IdLocal || 0, Label: "Local - " + partido.EquipoLocal },
			{ Id: partido.IdVisitante || 0, Label: "Visitante - " + partido.EquipoVisitante }
		]);
	}, [partido.EquipoLocal, partido.EquipoVisitante, partido.Id, partido.IdLocal, partido.IdVisitante]);


	const checkEquipo = useCallback((idEquipo: number): Promise<void> => {
		return new Promise((resolve) => {
			if (listaJugadoresLocalStorage.current.some(lista => lista.Id === idEquipo) === false) {
				setContadorLoading(1);
				getJugadoresXTorneoEquipoService(idTorneo, idEquipo)
					.then(jugadoresLista => {
						listaJugadoresLocalStorage.current.push({ "Id": idEquipo || 0, "Jugadores": jugadoresLista });
						localStorage.setItem('listaJugadores', JSON.stringify(listaJugadoresLocalStorage.current));
						resolve();
						setContadorLoading(-1);
					});
			} else {
				resolve();
			}
		});
	}, [idTorneo]);


	const iniciarForm = useCallback(() => {
		// Iniciar el form al entrar, después de insertar un evento o después de eliminar uno
		setForm(DefaultEventoType);
		setForm(prev => ({
			...prev
			, Tiempo: 1
			, Evento: "G"
			, IdPartido: partido.Id || 0
		}));
	}, [partido.Id]);


	useEffect(() => {
		// Chequear que los jugadores de ambos equipos esten cargados
		const runChecks = async () => {
			if (partido.IdLocal !== undefined && partido.IdVisitante !== undefined) {
				await checkEquipo(partido.IdLocal);
				await checkEquipo(partido.IdVisitante);
				getEventosDesdeAPI();
				handleChangeEquipo(partido.IdLocal);
			}
		};
		iniciarForm();
		listaJugadoresLocalStorage.current = JSON.parse(localStorage.getItem('listaJugadores') || '[]');
		runChecks();
		setListaEventos([]);
	}, [partido.IdLocal, partido.IdVisitante, checkEquipo, getEventosDesdeAPI, iniciarForm]);


	const handleAgregarEvento = () => {
		// se agrega el registro, se limpia el input y se limpia el form para el próximo evento
		setListaEventos([...listaEventos, form]);
		autocompleteRef.current?.clear();
		autocompleteRefJugadorCambio.current?.clear();
		setForm(prev => ({
			...prev
			, IdPartido: partido.Id || 0
			, IdEquipo: idEquipo
			, NombreJugador: ""
			, NombreJugadorIngreso: ""
			, IdJugador: 0
			, IdJugadorIngreso: 0
		}));
		//console.log(listaEventos);
	};


	const handleBorrarEvento = (idx: number) => {
		setListaEventos(listaEventos.filter((_, index) => index !== idx));
	}


	return (
		<>
			<div
				className={`modal fade ${show ? 'show' : ''}`}
				style={{ display: show ? 'block' : 'none' }} >
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Carga de Eventos</h5>
							<button
								onClick={handleClose}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Cerrar"></button>
						</div>
						<div className="modal-body">
							<div className="container">
								<div className="row">
									<div className="col-4">
										<div className="form-group">
											<label htmlFor="Tiempo" className="control-label">Tiempo</label>
											<select
												className="form-select"
												id='Tiempo'
												value={form.Tiempo}
												onChange={(e) => setForm(prev => ({ ...prev, Tiempo: Number(e.target.value) }))}>
												<option value="1">Primer Tiempo</option>
												<option value="2">Segundo Tiempo</option>
												<option value="3">1er. Tiempo Alargue</option>
												<option value="4">2do. Tiempo Alargue</option>
											</select>
										</div>
									</div>
									<div className="col-4">
										<div className="form-group">
											<label htmlFor="IdEquipo" className="control-label">Equipo</label>
											{
												<select
													value={form.IdEquipo}
													onChange={(e) => handleChangeEquipo(Number(e.target.value))}
													className="form-select"
													id="IdEquipo">
													{
														listaEquipos.map(equipo => {
															return (
																<option key={equipo.Id} value={equipo.Id}>{equipo.Label}</option>
															)
														})
													}
												</select>
											}
										</div>
									</div>
								</div>
								<form className="form form-horizontal form-theme">
									<div className="row">
										<div className="col-2">
											<div className="form-group">
												<label htmlFor="Evento" className="control-label">Evento</label>
												{
													<select
														value={form.Evento}
														onChange={(e) => setForm(prev => ({ ...prev, Evento: e.target.value }))}
														className="form-select"
														id="Evento">
														<option value="G">Gol</option>
														<option value="A">Amarilla</option>
														<option value="R">Roja</option>
														<option value="X">Cambio</option>
														<option value="C">Autogol</option>
													</select>
												}
											</div>
										</div>
										<div className="col-2">
											<div className="form-group">
												<label htmlFor="Minuto" className="control-label">Minuto</label>
												{
													<input
														onFocus={(e) => e.target.select()}
														value={form.Minuto}
														onChange={(e) => setForm(prev => ({ ...prev, Minuto: Number(e.target.value) }))}
														type="number"
														className="form-control"
														id="Minuto"
														min="0"
														max="200" />
												}
											</div>
										</div>
										<div className="col-4 ui-front">
											<div className="form-group autocomplete-container">
												<label htmlFor="IdJugador" className="control-label">Jugador</label>
												{
													<Autocomplete
														options={listaJugadoresSelect.current}
														onSelect={handleSelectJugador}
														ref={autocompleteRef}
													/>
												}
											</div>
										</div>
										{
											form.Evento === "X" ?
												<div className="col-3 ui-front">
													<div className="form-group autocomplete-container">
														<label htmlFor="IdJugador" className="control-label">Jugador Ingreso</label>
														<Autocomplete
															options={listaJugadoresIngresoSelect.current}
															onSelect={val => setForm(prev => ({ ...prev, IdJugadorIngreso: val.Id, NombreJugadorIngreso: val.Label }))}
															ref={autocompleteRefJugadorCambio}
														/>
													</div>
												</div>
												:
												<div className="col-3 jugador-ingreso ui-front">
												</div>
										}
										<div className="col-1">
											<div className="form-group">
												{
													<button
														onClick={() => handleAgregarEvento()}
														type="button"
														disabled={
															(form.IdJugador === 0)
															|| (form.Evento === "")
															|| (form.Evento === "X" && form.IdJugadorIngreso === 0)
															|| (form.Tiempo === 0)
														}
														className="btn btn-xs btn-primary">Ok</button>
												}
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-4"></div>
									</div>
								</form>
							</div >
							<div className="container">
								{
									<div className="lista-datos">
										<GrillaEventos
											listaDatos={listaEventos}
											partido={partido}
											borrarDato={handleBorrarEvento}
										/>
									</div>
								}
							</div>
						</div >
						<div className="modal-footer">
							{
								<>
									<button
										onClick={post}
										type="button"
										className="btn btn-primary btn-guardar">Guardar</button>
									<button
										onClick={handleClose}
										type="button"
										className="btn btn-secondary"
										data-bs-dismiss="modal"
										aria-label="Close">Cerrar</button>
								</>
							}
						</div>
					</div >
				</div >
			</div>
			<Loading contador={contadorLoading} />
			{show &&
				<div className="modal-backdrop fade show" onClick={handleClose}></div>
			}
		</>
	)
}
