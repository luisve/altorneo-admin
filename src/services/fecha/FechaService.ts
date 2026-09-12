import { apiGET } from '../../utils/httpClient';
import { FechaType } from '../../types/fecha/FechaType';
import { FechasJugadoresInhabilitadosType } from '../../types/fecha/fechasJugadoresInhabilitadosType';


// Obtener la lista de fechas
export const getListaFechaService = async (idTorneo: number): Promise<FechaType[]> => {
	const fechaList = await apiGET<any[]>('Fecha/GetList?IdTorneo=' + idTorneo);
	return fechaList;
};


// Obtener la lista de fechas
export const getListaFechaInhabilitadaXJugadorService = async (idTorneo: number, idJugador: number): Promise<FechasJugadoresInhabilitadosType[]> => {
	return await apiGET<any[]>('FechaJugadoresInhabilitados?idTorneo=' + idTorneo + '&idJugador=' + idJugador);
};

