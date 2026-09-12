import { EquipoType } from '../../types/config/EquipoType';
import { apiGET, apiPOSTForm } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { EquipoView } from '../../views/config/EquipoView';


// Obtener lista de equipos
export const getEquiposXCategoriaService = async (idCategoria: number): Promise<EquipoView[]> => {
	return await apiGET<EquipoView[]>('Equipo?idCategoria=' + idCategoria);
};


// Obtener equipo
export const getEquipoService = async (idEquipo:number | null): Promise<EquipoType> => {
	return await apiGET<EquipoType>('Equipo?Id=' + idEquipo );
};

export const postEquipoService = async (equipo: FormData): Promise<ApiResponseArray<[]>> => {
	return await apiPOSTForm<ApiResponseArray<[]>, FormData>('/Equipo', equipo);
};

