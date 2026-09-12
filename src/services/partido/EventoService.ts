import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { EventoType, postEventoType } from '../../types/partido/EventoType';


// Post de datos del partido
export const postEventoService = async (jsonData: postEventoType): Promise<ApiResponseArray<[]>> => {
	 return await apiPOST<ApiResponseArray<[]>, postEventoType>('fechaPartidoEventos/setEventos', jsonData);
};


// Obtener los eventos del partido
export const getEventoListaService = async (idPartido: number): Promise<EventoType[]> => {
   return await apiGET<EventoType[]>( "fechaPartidoEventos/getEventos?idPartido=" + idPartido);
};