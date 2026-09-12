import { CategoriaView } from '../../views/config/CategoriaView';
import { CategoriaType } from '../../types/config/CategoriaType';
import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';


// Obtener lista de categorias
export const getCagetoriaListService = async (): Promise<CategoriaView[]> => {
	return await apiGET<CategoriaView[]>('Categoria');
};


// Obtener categoria
export const getCagetoriaService = async (params:number | null): Promise<CategoriaView> => {
	return await apiGET<CategoriaView>('Categoria?Id=' + params );
};


// Enviar nueva categoria
export const postCategoriaService = async (categoria: CategoriaType): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, CategoriaType>('/Categoria', categoria);
};

