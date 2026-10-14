import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { TorneoEquipoJugadorType } from '../../types/torneo/TorneoEquipoJugadoresType';


// Obtener lista de torneos
export const getJugadoresXTorneoEquipoService = async (idTorneo: number, idEquipo: number): Promise<TorneoEquipoJugadorType[]> => {
	return await apiGET<TorneoEquipoJugadorType[]>('torneoEquipoJugadores/getJugadores?idTorneo=' + idTorneo + '&idEquipo=' + idEquipo);
};

export const postTorneoEquipoJugadorCheckService = async (jsonData: Record<string, any>): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, Record<string, any>>('TorneoEquipoJugadores/Check', jsonData);
};