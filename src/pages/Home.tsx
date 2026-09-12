import { Menu } from '../components/Menu';


export const Home = () => {


	return (
		<>
			<Menu />
			<div className="container">
				<h3 className='text-center m-5'>
					Pantalla inicial del sistema
				</h3>
				<p className="h5">
					Comienza desde la configuración de los torneos en adelante, de derecha a izquierda. Se dan de alta las sede, jueces, equipos, jugadores para luego generar los torneos.
				</p>
				<p className="h5">
					Se habilitan los equipos y jugadores participantes, se establecen los puntajes y se genera las fechas.
				</p>
				<p className="h5">
					Luego queda asignar día, hora, sede y demás datos de los partidos para que los jugadores puedan ver las fechas.
				</p>
				<p className="h5">
					Al terminar cada partido se cargan los datos y el sistema genera la tabla de posiciones automáticamente.
				</p>
			</div>
		</>
	)
}

export default Home;