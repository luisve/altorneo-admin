
import { useEffect } from "react";
import jsPDF from "jspdf";

export interface Column<T> {
	key: Extract<keyof T, string>;
	label: string;
	width?: number;
	format?: (value: unknown, row: T) => string;
}

/*
ejemplo de datos interfase PDFTitulos
[{ texto: "Campeonato", tamano: 18, estilo: "bold", align: "left" },
{ texto: "Torneo", tamano: 16, estilo: "bold", align: "left" },
{ texto: "Partidos de 08/10/2026", tamano: 14, estilo: "bold", align: "left" },]
*/
export interface PDFTitulos {
	texto: string;
	tamano?: number;
	estilo?: "normal" | "bold" | "italic" | "bolditalic";
	color?: [number, number, number];
	align?: "left" | "center" | "right";
	font?: string;
	espaciado?: number;
}

interface ImprimirPDFProps<T extends object> {
	data: T[];
	columns: Column<T>[];
	titulos: PDFTitulos[];
	nombreArchivo?: string;
	autoAbrir?: boolean;
}

export function ImprimirPDF<T extends object>({
	data,
	columns,
	titulos,
	autoAbrir = true,
}: ImprimirPDFProps<T>) {
	const cellToString = (value: unknown): string => {
		if (value == null) return "";
		if (typeof value === "boolean") return value ? "Sí" : "No";
		return String(value);
	};

	const generarPDF = (): jsPDF => {
		const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();

		const marginX = 40;
		const marginTop = 60;
		const marginBottom = 40;
		const rowHeight = 20;
		const headerHeight = 24;
		const fontSize = 10;

		const totalWeight = columns.reduce((s, c) => s + (c.width ?? 1), 0);
		const usableWidth = pageWidth - marginX * 2;
		const colWidths = columns.map((c) => ((c.width ?? 1) / totalWeight) * usableWidth);

		let y = marginTop;

		const drawTitulos = () => {
			titulos.forEach(item => {
				doc.setFont(
					item.font ?? "helvetica",
					item.estilo ?? "normal"
				);
				doc.setFontSize(item.tamano ?? 12);
				const color = item.color ?? [0, 0, 0];
				doc.setTextColor(color[0], color[1], color[2]);
				let x = marginX;
				switch (item.align) {
					case "center":
						x = marginX + usableWidth / 2;
						doc.text(item.texto, x, y, { align: "center" });
						break;
					case "right":
						x = marginX + usableWidth;
						doc.text(item.texto, x, y, { align: "right" });
						break;
					default:
						doc.text(item.texto, x, y);
						break;
				}
				y += item.espaciado ?? ((item.tamano ?? 15));
			});
			y += 5;
		};
		drawTitulos();

		
		const drawHeader = () => {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(fontSize);
			doc.setFillColor(240, 240, 240);

			// ✅ La cabecera empieza EXACTAMENTE en y
			doc.rect(marginX, y, usableWidth, headerHeight, "F");

			let x = marginX;
			columns.forEach((col, i) => {
				const w = colWidths[i];
				doc.rect(x, y, w, headerHeight);
				// Texto centrado verticalmente dentro de la celda
				doc.text(col.label, x + 4, y + headerHeight / 2 + 3);
				x += w;
			});

			y += headerHeight; // ✅ ahora y = top de la primera fila
		};
		drawHeader();


		doc.setFont("helvetica", "normal");
		doc.setFontSize(fontSize);

		data.forEach((row, rowIdx) => {
			// salto de página...
			if (y + rowHeight > pageHeight - marginBottom) {
				doc.addPage();
				y = marginTop;
				//drawHeader();
				drawTitulos();
				doc.setFont("helvetica", "normal");
				doc.setFontSize(fontSize);
			}

			if (rowIdx % 2 === 1) {
				doc.setFillColor(250, 250, 250);
				doc.rect(marginX, y, usableWidth, rowHeight, "F"); // ✅ top = y
			}

			let x = marginX;
			columns.forEach((col, i) => {
				const w = colWidths[i];
				const raw = (row as Record<string, unknown>)[col.key];
				const text = col.format ? col.format(raw, row) : cellToString(raw);

				const maxChars = Math.max(1, Math.floor(w / (fontSize * 0.55)));
				const display = text.length > maxChars ? text.slice(0, maxChars - 1) + "…" : text;

				doc.rect(x, y, w, rowHeight); // ✅ top = y
				doc.text(display, x + 4, y + rowHeight / 2 + 3); // ✅ centrado vertical
				x += w;
			});

			y += rowHeight; // ✅ ahora y = top de la siguiente fila
		});


		/* ----------------------------------------------------------------------*/
		// ===== Pie de página con numeración =====
		const totalPages = doc.getNumberOfPages();

		for (let i = 1; i <= totalPages; i++) {
			doc.setPage(i);

			const pageW = doc.internal.pageSize.getWidth();
			const pageH = doc.internal.pageSize.getHeight();

			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.setTextColor(100);

			// Texto izquierda: título o fecha
			const fecha = new Date().toLocaleDateString("es-AR");
			//doc.text(`${titulos} — ${fecha}`, marginX, pageH - 20);
			doc.text(`${fecha}`, marginX, pageH - 20);

			// Texto centrado: "Página X de Y"
			const textoPagina = `Página ${i} de ${totalPages}`;
			const anchoTexto = doc.getTextWidth(textoPagina);
			doc.text(textoPagina, (pageW - anchoTexto) / 2, pageH - 20);

			// Texto derecha: nombre del archivo o lo que quieras
			const derecho = titulos[0].texto;
			const anchoDerecho = doc.getTextWidth(derecho);
			doc.text(derecho, pageW - marginX - anchoDerecho, pageH - 20);

			// Línea separadora
			doc.setDrawColor(200);
			doc.line(marginX, pageH - 30, pageW - marginX, pageH - 30);

			// Reset color para no afectar otras páginas
			doc.setTextColor(0);
		}
		/* ***********************************************************************/



		return doc;
	};

	/** Abre el PDF en una pestaña nueva */
	const abrirEnPestana = () => {
		const doc = generarPDF();
		const blobUrl = doc.output("bloburl");
		// bloburl devuelve un string | URL; forzamos string
		window.open(String(blobUrl), "_blank");
	};

	useEffect(() => {
		if (autoAbrir) abrirEnPestana();
	}, []);

	// Si no auto-abre, muestra un botón
	if (autoAbrir) return null;

	return (
		<button onClick={abrirEnPestana}>Abrir PDF en pestaña nueva</button>
	);
}
