import { apiGET, apiPOST } from '../../utils/httpClient';
import { ApiResponseArray } from '../../types/ApiResponseType';
import { FechaType } from '../../types/fecha/FechaType';
import { FixtureManualView } from '../../views/torneo/FixtureView';
import { EquipoView } from '../../views/config/EquipoView';


// Obtener equipos habilitados
export const getEquiposHabilitados = async (idTorneo: number): Promise<EquipoView[]> => {
	return await apiGET<EquipoView[]>('TorneoEquipos/GetEquiposHabilitados?IdTorneo=' + idTorneo);
};


// Obtener fechas del torneo
export const getFechas = async (idTorneo: number): Promise<FechaType[]> => {
	return await apiGET<FechaType[]>('Fechas?IdTorneo=' + idTorneo);
};


// Genera el fixture
export const postGenerarFixtureService = async (jsonData: Record<string, any>): Promise<ApiResponseArray<[]>> => {
	return await apiPOST<ApiResponseArray<[]>, Record<string, any>>('Fechas', jsonData);
};


// Sube el fixture manual
export const postFixtureManualService = async (jsonData: FixtureManualView): Promise<ApiResponseArray<[]>> => {
	return apiPOST<ApiResponseArray<[]>, FixtureManualView>('FixtureManual', jsonData);
};

