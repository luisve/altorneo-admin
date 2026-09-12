import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { TorneoDatosType } from '../../types/torneo/torneoDatosType';


// Obtener lista de torneos
export const getTorneoDatosService = async (idTorneo: number): Promise<TorneoDatosType> => {
	return await apiGET<TorneoDatosType>('Torneo/GetDatos?IdTorneo=' + idTorneo);
};


export const postTorneoIniciarService = async (jsonData: Record<string,any>): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, Record<string,any>>('Torneo/Iniciar', jsonData);
};

