
import { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { getReciboDatosService } from "../services/torneo/TorneoEquipoPagoService";
import { DefaultTorneoEquipoPagoView, TorneoEquipoPagoView } from "../views/torneo/TorneoEquipoPagoView";
import { currencyFormatter } from "../utils/formatNumber";


interface ReciboPDFProps {
	idRecibo: number;
	nombreArchivo?: string;
	autoAbrir?: boolean;
}

export function FechaPagoReciboPDF({
	idRecibo,
	autoAbrir = true,
}: ReciboPDFProps) {

	const reciboDatos = useRef<TorneoEquipoPagoView>(DefaultTorneoEquipoPagoView);


	const generarPDF = (): jsPDF => {
		const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
		const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
		const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
		const margin = 10;
		const contentWidth = pageWidth - margin * 2; // 180 mm

		const tamanoTexto = 12;
		const tamanoTitulo = 14;
		const tamanoNotas = 10;


		// ====== 1. HEADER: Campeonato (izq) | Recibo (der) ======
		const headerY = margin;
		const headerH = 30;
		const halfW = contentWidth / 2;

		// --- Cuadro izquierdo: campeonato ---
		doc.setDrawColor(180);
		doc.setLineWidth(0.2);
		doc.rect(margin, headerY, halfW, headerH);

		doc.setFont("helvetica", "normal");
		doc.setFontSize(tamanoTitulo);
		doc.setTextColor(0);
		doc.text('Campeonato', margin + 3, headerY + 8);
		doc.setFont("helvetica", "bold");
		doc.text(reciboDatos.current.CampeonatoNombre, margin + 5, headerY + 13);
		doc.setFont("helvetica", "normal");
		doc.text('Torneo', margin + 3, headerY + 18);
		doc.setFont("helvetica", "bold");
		doc.text(reciboDatos.current.TorneoNombre, margin + 5, headerY + 23);


		// --- Cuadro derecho: factura ---
		const rightX = margin + halfW;
		doc.rect(rightX, headerY, halfW, headerH);

		// Banda de título
		doc.setFontSize(tamanoTexto);
		doc.setFont("helvetica", "normal");

		doc.text('Recibo: ' + String(reciboDatos.current.NComprobante).padStart(8, '0'), pageWidth - margin - 3, headerY + 8, { align: "right" });


		doc.text('Equipo', rightX + halfW / 2, headerY + 13, { align: "center" });
		doc.setFont("helvetica", "bold");
		doc.text(reciboDatos.current.EquipoNombre, rightX + halfW / 2, headerY + 18, { align: "center" });
		doc.setFont("helvetica", "normal");
		doc.text('Equipo', rightX + halfW / 2, headerY + 13, { align: "center" });

		doc.rect(margin, headerY + headerH, contentWidth - 50, headerH);
		doc.rect(margin, headerY + headerH, contentWidth, headerH);
		doc.text('Pago por participación en el torneo "' + reciboDatos.current.TorneoNombre + '"', margin + 3, headerY + headerH + 8);
		doc.setFontSize(tamanoNotas);
		doc.text(
			reciboDatos.current.Obs
			, margin + 3
			, headerY + headerH + 8 + 8);

		doc.setFontSize(tamanoTexto);
		doc.text(
			currencyFormatter.format(reciboDatos.current.Importe)
			, contentWidth + margin
			, headerY + headerH + 8
			, { align: "right" }
		);

		doc.rect(margin, headerY + headerH + headerH, contentWidth - 50, 10);
		doc.rect(margin, headerY + headerH + headerH, contentWidth, 10);
		doc.text(
			'Total'
			, contentWidth - 50
			, headerY + headerH + headerH + 8
			, { align: "right" }
		);
		doc.text(
			currencyFormatter.format(reciboDatos.current.Importe)
			, contentWidth + margin
			, headerY + headerH + headerH + 8
			, { align: "right" }
		);


		doc.setTextColor(0);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);

		/* ----------------------------------------------------------------------*/
		// ===== Pie de página con numeración =====
		const totalPages = doc.getNumberOfPages();

		for (let i = 1; i <= totalPages; i++) {
			doc.setPage(i);
			const fecha = new Date().toLocaleDateString("es-AR");
			doc.text(`${fecha}`, margin, pageHeight - margin / 2);
			const textoPagina = `Página ${i} de ${totalPages}`;
			const anchoTexto = doc.getTextWidth(textoPagina);
			doc.text(textoPagina, (pageWidth - anchoTexto) / 2, pageHeight - margin / 2);
			const derecho = 'Recibo';
			const anchoDerecho = doc.getTextWidth(derecho);
			doc.text(derecho, pageWidth - margin - anchoDerecho, pageHeight - margin / 2);
			doc.setDrawColor(200);
			doc.line(margin, pageHeight - margin, pageWidth - margin, pageHeight - margin);
			doc.setTextColor(0);
		}



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
		if (autoAbrir) {
			getReciboDatosService(idRecibo)
				.then((datos) => {
					reciboDatos.current = datos;
					abrirEnPestana();
				})
		}
	}, []);

	// Si no auto-abre, muestra un botón
	if (autoAbrir) return null;

	return (
		<button onClick={abrirEnPestana}>Abrir PDF en pestaña nueva</button>
	);
}
