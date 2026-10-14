import { apiGET } from '../../utils/httpClient';


// Obtener lista de torneos
export const getTorneoDatosTitulosService = async (idTorneo?: number): Promise<{ campeonato: string, torneo: string }> => {
	return await apiGET<{ campeonato: string, torneo: string }>('torneo/getDatos?idTorneo=' + idTorneo);
};



