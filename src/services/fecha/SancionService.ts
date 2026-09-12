import { apiGET, apiPOST } from '../../utils/httpClient';
import { SancionType } from '../../types/fecha/SancionType';
import { FechasJugadoresInhabilitadosType } from '../../types/fecha/fechasJugadoresInhabilitadosType';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { FechaDescontarTarjetaType } from '../../types/fecha/fechaDescontarTarjetaType';


// Obtener las sanciones del torneo
export const getSancionListaService = async (idTorneo: number): Promise<SancionType[]> => {
    return await apiGET<SancionType[]>("FechaInfo?idTorneo=" + idTorneo);
};


// Post de las fechas en las que el jugador está inhabilitado
export const postFechasInhabilitadoService = async (jsonData: FechasJugadoresInhabilitadosType[]): Promise<ApiResponseArray<[]>> => {
    return await apiPOST<ApiResponseArray<[]>, FechasJugadoresInhabilitadosType[]>('FechaJugadoresInhabilitados', jsonData);
};



// Post descontar tarjetas amarillas
export const postTarjetasDescontarService = async (jsonData: FechaDescontarTarjetaType): Promise<ApiResponseArray<[]>> => {
    return await apiPOST<ApiResponseArray<[]>, FechaDescontarTarjetaType>('FechaInfo', jsonData);
};

