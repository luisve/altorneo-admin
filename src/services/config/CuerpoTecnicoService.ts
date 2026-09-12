//import { EquipoType } from '../../types/config/equipoType';
import { apiGET, apiPOST, apiPOSTForm } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { CuerpoTecnicoView } from '../../views/config/CuerpoTecnicoView';
import { EquipoCTType } from '../../types/config/EquipoCTType';
import { ParticipanteType } from '../../types/config/ParticipanteType';


// Obtener lista de tecnico
export const getCuerpoTecnicoListService = async (idEquipo: number): Promise<CuerpoTecnicoView[]> => {
	return await apiGET<CuerpoTecnicoView[]>('equipoCT/getList?idEquipo=' + idEquipo);
};

// Obtener tecnico
export const getTecnicoService = async (idTecnico:number): Promise<{tecnico:EquipoCTType, participante:ParticipanteType}> => {
	return await apiGET<{tecnico:EquipoCTType, participante:ParticipanteType}>('equipoCT/get?id=' + idTecnico );
};


export const postSwitchCTService = async (id: number): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, { id: number }>('equipoCT/switch', { id });
};

export const postTecnicoService = async (tecnico: FormData): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, FormData>('/equipoCT', tecnico);
};

