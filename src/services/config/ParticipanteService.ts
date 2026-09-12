// import { EquipoType } from '../../types/config/equipoType';
import { ApiResponseObject } from '../../types/ApiResponseType';
import { ParticipanteType } from '../../types/config/ParticipanteType';
import { apiGET } from '../../utils/httpClient';


// Obtener jugador
export const getParticipanteXDNIService = async (dni:number): Promise<ApiResponseObject<ParticipanteType>> => {
	return await apiGET<ApiResponseObject<ParticipanteType>>('participante/getXDNI?dni=' + dni );
};
