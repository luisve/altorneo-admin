import { SelectType } from '../types/SelectType';
import { apiGET } from '../utils/httpClient';
import { apiGETFront } from '../utils/httpClientFront';


// Obtener lista de sedes
export const getSedeSelectService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/Sede');
};


// Obtener Ciudades
export const getCiudadSelectService = async (params:number | null): Promise<SelectType[]> => {
	return await apiGETFront<SelectType[]>('Select/Ciudades?idPais=' + params );
};


// Obtener Paises
export const getPaisSelectService = async (): Promise<SelectType[]> => {
	return await apiGETFront<SelectType[]>('Select/Paises');
};


// Obtener Select Categorias con Equipos
export const getCategoriaConEquiposSelectService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/CategoriaConEquipos');
};


// Obtener Select Categorias
export const getCategoriaListService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/Categoria');
};


// Obtener Select Equipos
export const getEquipoSelectXCategoriaService = async ( idCategoria:number ): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/Equipo?idCategoria=' + idCategoria );
};


// Obtener Select Torneos Creados
export const getTorneosCreadosSelectService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/Torneo/Creado' );
};


// Obtener Select Torneos Iniciados
export const getTorneosIniciadosSelectService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('select/torneo/getIniciados');
};


// Obtener Select de Jueces
export const getJuezSelectService = async (): Promise<SelectType[]> => {
	return await apiGET<SelectType[]>('Select/Juez');
};

