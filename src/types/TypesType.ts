
//export type ColumnMap = { [key: string]: string }; // Ej: { A: "nombre", B: "telefono" }

export type Fila = { [key: string]: string };       // Ej: { A: "dato1", B: "dato2" }

export type SheetData = Fila[];

export type jsonJugadoresType = {data:SheetData, idEquipo:number};