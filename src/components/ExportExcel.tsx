import React from 'react';
import * as XLSX from 'xlsx';

// Tipo genérico para los datos: cualquier objeto con claves string
// type DataRow = Record<string, string | number | boolean | null | undefined>;

export interface Titulos {
	texto: string;
}

interface ExportExcelProps<T extends object> {
	titulos: Titulos[];
	data: T[];
	headers: string[];
	fileName?: string;
	sheetName?: string;
	filasEnBlanco?: number;
}

const ExportExcel = <T extends object>({
	titulos,
	data,
	headers,
	fileName = 'reporte',
	sheetName = 'Datos',
	filasEnBlanco = 1,
}: ExportExcelProps<T>): React.ReactElement => {
	const handleExport = (): void => {
    // 1. Hoja vacía (la construimos por bloques)
    const worksheet: XLSX.WorkSheet = {};

    // 2. Bloque de títulos: uno por fila en la columna A
    //    Ej: [["Título 1"], ["Título 2"], ["Título 3"]]
    const bloqueTitulos = titulos.map((t) => [t.texto]);
    XLSX.utils.sheet_add_aoa(worksheet, bloqueTitulos, { origin: "A1" });

    // 3. Fila de encabezados, después de N filas en blanco
    const filaHeaders = titulos.length + filasEnBlanco + 1; // +1 porque Excel es 1-based
    XLSX.utils.sheet_add_aoa(worksheet, [headers], {
      origin: `A${filaHeaders}`,
    });

    // 4. Datos, justo debajo de los encabezados
    const filaDatos = filaHeaders + 1;
    XLSX.utils.sheet_add_json(worksheet, data, {
      origin: `A${filaDatos}`,
      skipHeader: true, // ya pusimos los headers a mano
    });

    // 5. Ancho de columnas (opcional, para que se lean bien)
    worksheet["!cols"] = headers.map(() => ({ wch: 18 }));

    // 6. Crear libro y exportar
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, `${fileName}.xls`, { bookType: "xls" });
	};

	return (
		<button
			title='Exportar a xls'
			className='btn btn-primary m-1'
			onClick={handleExport}>
			<i className='fa-solid fa-file-excel'></i>
		</button>
	);
};

export default ExportExcel;