// import { EquipoType } from '../../types/config/equipoType';
import { ParticipanteType } from '../../types/config/ParticipanteType';
import { EquipoJugadorListView } from '../../views/config/EquipoJugadorListView';
import { apiGET, apiPOSTForm, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { Fila, jsonJugadoresType } from '../../types/TypesType';
import { EquipoJugadorType } from '../../types/config/EquipoJugadorType';


// Obtener lista de jugadores
export const getJugadoresXEquipoService = async (idEquipo: number): Promise<EquipoJugadorListView[]> => {
	return await apiGET<EquipoJugadorListView[]>('equipoJugador/getList?idEquipo=' + idEquipo);
};


// Obtener jugador
export const getJugadorService = async (idJugador: number): Promise<{ equipoJugador: EquipoJugadorType, participante: ParticipanteType }> => {
	return await apiGET<{ equipoJugador: EquipoJugadorType, participante: ParticipanteType }>('equipoJugador/get?id=' + idJugador);
};


// Enviar formulario de jugador
export const postJugadorFormService = async (jugador: FormData): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, FormData>('/equipoJugador/set', jugador);
};


// Enviar xls
export const postJugadorXLSService = async (xls: FormData): Promise<ApiResponseArray<Fila>> => {
	return await apiPOSTForm<ApiResponseArray<Fila>, FormData>('/Jugador/XLS', xls);
};


// Enviar ListadoJson
export const postJugadorJson = async (lista: jsonJugadoresType): Promise<ApiResponseArray<Fila>> => {
	return await apiPOST<ApiResponseArray<Fila>, jsonJugadoresType>('/Jugador/SetXLS', lista);
};


