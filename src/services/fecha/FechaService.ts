import { apiGET } from '../../utils/httpClient';
import { FechaType } from '../../types/fecha/FechaType';
import { FechasJugadoresInhabilitadosType } from '../../types/fecha/fechasJugadoresInhabilitadosType';
import { FechaParticipanteType } from '../../types/fecha/FechaParticipanteType';
import { FechaListadoView } from '../../views/Fecha/FechaListadoView';


// Obtener los participantes y el rango horario ocupado
export const getListadoService = async (dia: string): Promise<FechaListadoView[]> => {
	const participanteList = await apiGET<FechaListadoView[]>('fechas/getListado?dia=' + dia);
	return participanteList;
};


// Obtener los participantes y el rango horario ocupado
export const getParticipantesFechaService = async (idTorneo: number, idFecha: number, fecha: string): Promise<{ asignados: FechaParticipanteType[], libres: FechaParticipanteType[] }> => {
	const participanteList = await apiGET<{ asignados: FechaParticipanteType[], libres: FechaParticipanteType[] }>('fecha/partidos/getParticipantes?idTorneo=' + idTorneo + '&dia=' + fecha + '&idFecha=' + idFecha);
	return participanteList;
};


// Obtener la lista de fechas
export const getListaFechaService = async (idTorneo: number): Promise<FechaType[]> => {
	const fechaList = await apiGET<any[]>('Fecha/GetList?IdTorneo=' + idTorneo);
	return fechaList;
};


// Obtener la lista de fechas
export const getListaFechaInhabilitadaXJugadorService = async (idTorneo: number, idJugador: number): Promise<FechasJugadoresInhabilitadosType[]> => {
	return await apiGET<any[]>('FechaJugadoresInhabilitados?idTorneo=' + idTorneo + '&idJugador=' + idJugador);
};

