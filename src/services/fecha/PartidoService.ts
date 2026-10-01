import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { PartidoType, PartidoTypePost } from '../../types/partido/PartidoType';


// Post de datos del partido
export const postPartidoDatosService = async (jsonData: Record<string, any>): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, Record<string, any>>('Fecha/Partidos/SetDatos', jsonData);
};



// Post de datos del partido
export const postPartidosAutomaticoService = async (data: PartidoTypePost[]): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, PartidoTypePost[]>('fecha/partidos/setAutomatico', data);
};



// Obtener la lista de fechas
//export const getPartidoListaService = async (idFecha: number, idTorneo: number): Promise<PartidoType[]> => {
export const getPartidoListaService = async (idFecha: number): Promise<PartidoType[]> => {
	//return await apiGET<PartidoType[]>( "Fecha/Partidos/GetList?idFecha=" + idFecha + "&idTorneo=" + idTorneo);
	return await apiGET<PartidoType[]>("Fecha/Partidos/GetList?idFecha=" + idFecha);
};

