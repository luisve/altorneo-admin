import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';






import { lazy } from 'react';
import CuerpoTecnico from './pages/config/CuerpoTecnico';

const FechaConfirmar = lazy(() => import('./pages/fecha/FechaConfirmar'));
const FechaImprimir = lazy(() => import('./pages/fecha/FechaImprimir'));
const FechaEventos = lazy(() => import('./pages/fecha/FechaEventos'));
const FechaSanciones = lazy(() => import('./pages/fecha/FechaSanciones'));

//import { FechaConfirmar } from './pages/fecha/FechaConfirmar';
//import { FechaImprimir } from './pages/fecha/FechaImprimir';
//import { FechaEventos } from './pages/fecha/FechaEventos';
//import { FechaSanciones } from './pages/fecha/FechaSanciones';


const TorneoPagos = lazy(() => import('./pages/torneo/TorneoPagos'));
const TorneoFechas = lazy(() => import('./pages/torneo/TorneoFechas'));
const TorneoEquipos = lazy(() => import('./pages/torneo/TorneoEquipos'));
const TorneoAlta = lazy(() => import('./pages/torneo/TorneoAlta'));
const TorneoIniciar = lazy(() => import('./pages/torneo/TorneoIniciar'));

//import { TorneoIniciar } from './pages/torneo/TorneoIniciar';
//import { TorneoPagos } from './pages/torneo/TorneoPagos';
//import { TorneoFechas } from './pages/torneo/TorneoFechas';
//import { TorneoEquipos } from './pages/torneo/TorneoEquipos';
//import { TorneoAlta } from './pages/torneo/TorneoAlta';


const Jugadores = lazy(() => import('./pages/config/Jugadores'));
const Equipos = lazy(() => import('./pages/config/Equipos'));
const Jueces = lazy(() => import('./pages/config/Jueces'));
const Categorias = lazy(() => import('./pages/config/Categorias'));
const Sedes = lazy(() => import('./pages/config/Sedes'));

//import { Jugadores } from './pages/config/Jugadores';
//import { Equipos } from './pages/config/Equipos';
//import { Jueces } from './pages/config/Jueces';
//import { Categorias } from './pages/config/Categorias';
//import { Sedes } from './pages/config/Sedes'


const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));

//import { Login } from './pages/Login'
//import { Home } from './pages/Home';


function App() {


	return (
		<>
			<BrowserRouter basename="/admin">
				<Routes>
					<Route path='/FechaSanciones' element={<FechaSanciones />} />
					<Route path='/FechaEventos' element={<FechaEventos />} />
					<Route path='/fechaImprimir' element={<FechaImprimir />} />
					<Route path='/fechaConfirmar' element={<FechaConfirmar />} />

					<Route path='/torneoIniciar' element={<TorneoIniciar />} />
					<Route path='/torneoPagos' element={<TorneoPagos />} />
					<Route path='/torneoFechas' element={<TorneoFechas />} />
					<Route path='/torneoEquipos' element={<TorneoEquipos />} />
					<Route path='/torneoAlta' element={<TorneoAlta />} />

					<Route path='/jugadores' element={<Jugadores />} />
					<Route path='/cuerpotecnico' element={<CuerpoTecnico />} />
					<Route path='/equipos' element={<Equipos />} />
					<Route path='/jueces' element={<Jueces />} />
					<Route path="/categorias" element={<Categorias />} />
					<Route path="/sedes" element={<Sedes />} />

					<Route path="/home" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Login />} />
					<Route path="*" element={<Login />} />
				</Routes>
				<ToastContainer
					position="top-right"
					autoClose={1000}
					hideProgressBar
					pauseOnHover={false} />
			</BrowserRouter>
		</>
	)
}


export default App