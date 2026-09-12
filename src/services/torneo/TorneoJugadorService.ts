// import { TorneoType } from '../../types/torneo/torneoType';
import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
// import { EquipoType } from '../../types/config/equipoType';
//import { JugadorType } from '../../types/config/JugadorType';
// import { EquipoJugadorListView } from '../../views/config/EquipoJugadorListView';
import { TorneoEquipoJugadorType } from '../../types/torneo/TorneoEquipoJugadoresType';
// import { TorneoEquipoPagoType } from '../../types/torneo/TorneoEquipoPagoType';


// Obtener lista de torneos
export const getJugadoresXTorneoEquipoService = async (idTorneo: number, idEquipo: number): Promise<TorneoEquipoJugadorType[]> => {
	return await apiGET<TorneoEquipoJugadorType[]>('torneoEquipoJugadores/getJugadores?idTorneo=' + idTorneo + '&idEquipo=' + idEquipo);
};

export const postTorneoEquipoJugadorCheckService = async (jsonData: Record<string, any>): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, Record<string, any>>('TorneoEquipoJugadores/Check', jsonData);
};


// Obtener torneo
/*
export const getTorneoService = async (id: number): Promise<TorneoType> => {
	return await apiGET<TorneoType>('Torneo?Id=' + id);
};
*/
/*
export const postTorneoEquipoCheckService = async (jsonData: Record<string,any>): Promise<ApiResponseType<[]>> => {
	 return await apiPOST<ApiResponseType<[]>, Record<string,any>>('TorneoEquipos/Check', jsonData);
};
*/