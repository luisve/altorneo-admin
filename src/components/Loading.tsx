import { useEffect, useState } from 'react'


type LoadingProps = {
	contador: number;
};


export const Loading = ({ contador }: LoadingProps) => {


	const [contadorLoading, setContadorLoading] = useState(0);


	useEffect(() => {
		if (contador > 0) {
			setContadorLoading(prev => prev + 1);
		} else {
			setContadorLoading(prev => Math.max(0, prev - 1));
		}
	}, [contador]);


	return (
		<>
			{
				contadorLoading > 0 &&
				<div
					className="justify-content-center align-items-center"
					style={{ 'position': 'absolute', 'top': 0, 'left': 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 1100, display: 'flex', flexDirection: 'column' }}	>
					<div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
						<span className="visually-hidden">Cargando...</span>
					</div>
				</div>
			}
		</>
	)
}
