import { Modal } from "bootstrap";
import { useRef, useEffect, useState, useCallback } from "react";

export const useBootstrapModal = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const modalInstanceRef = useRef<Modal | null>(null); // ✅ NUEVO: Instancia única
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => { // ✅ useCallback para estabilidad
		if (ref.current) {
			if (!modalInstanceRef.current) {
				modalInstanceRef.current = new Modal(ref.current); // ✅ Crear UNA vez
			}
			modalInstanceRef.current.show();
		}
	}, []);

	const close = useCallback(() => { // ✅ useCallback
		if (modalInstanceRef.current) {
			modalInstanceRef.current.hide();
		}
	}, []);

	useEffect(() => {
		if (!ref.current) return;

		const el = ref.current;

		const handleShown = () => setIsOpen(true);
		const handleHidden = () => {
			setIsOpen(false);
			// ✅ DESTRUIR modal al cerrar (SOLUCIÓN al problema de ID)
			if (modalInstanceRef.current) {
				modalInstanceRef.current.dispose();
				modalInstanceRef.current = null;
			}
		};

		el.addEventListener("shown.bs.modal", handleShown);
		el.addEventListener("hidden.bs.modal", handleHidden);

		return () => {
			el.removeEventListener("shown.bs.modal", handleShown);
			el.removeEventListener("hidden.bs.modal", handleHidden);
			// ✅ Cleanup final
			if (modalInstanceRef.current) {
				modalInstanceRef.current.dispose();
				modalInstanceRef.current = null;
			}
		};
	}, []);

	return { 
		ref, 
		open, 
		close, 
		isOpen,
		modalRef: modalInstanceRef.current
	};
};