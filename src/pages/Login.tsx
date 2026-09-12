import { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


import { Loading } from '../components/Loading';
import { MenuFront } from '../components/MenuFront';


import { DefaultLoginType, LoginType } from '../types/LoginType';


import { LoginService, PostResetpasswordService } from '../services/LoginService';


const Login = () => {


	const [contadorLoading, setContadorLoading] = useState<number>(0);
	const [form, setForm] = useState<LoginType>(DefaultLoginType);


	const formChange = (data: Record<string, any>) => {
		Object.keys(data).forEach((key) => {
			setForm(prev => ({
				...prev,
				[key]: data[key]
			}));
		});
	};


	const navigate = useNavigate();
	const [box, setBox] = useState("login");


	const postRestePassword = () => {
		if (form.MailReset === "") {
			toast.warning('Debe ingresar una dirección de mail válida', { autoClose: 3000, });
			return;
		}
		const jsonData = {
			Mail: form.MailReset,
		}
		setContadorLoading(1);
		PostResetpasswordService(jsonData)
			.then((resp) => {
				if (resp.msg === "ok") {
					toast.success('Se ha enviado un mail a la dirección indicada, revise las bandejas de correo y podrá recuperar su password', { autoClose: 3000, });
				}
			})
			.finally(() => {
				setContadorLoading(-1);
			});
	}


	const handleKeyUP = (e: string) => {
		if (e === 'Enter') {
			postLogin();
		}
	}


	const postLogin = async () => {
		if ((form.Mail === "") || (form.Password === "")) {
			toast.warning('Debe completar los campos Usuario y Contraseña', { autoClose: 3000, });
			return;
		}
		setContadorLoading(1);
		const data = await LoginService(form);
		if (data.code === 200) {
			toast.success(data.msg);
			navigate('/home/');
		} else {
			toast.error(data.msg, { autoClose: 3000, });
		}
		setContadorLoading(-1);
	}


	return (
		<>
			<MenuFront />
			<section className="container">
				<div className="row justify-content-center mt-5">
					<div className="col-12 col-md-8 col-lg-6">
						{
							box === "login" &&
							<div className="card shadow">
								<div className="card-header">
									<h4>Login</h4>
								</div>
								<div className="card-body">
									<form>
										<div className='row mb-3'>
											<label className="col-sm-3 col-form-label" htmlFor='Mail'>Email</label>
											<div className='col-sm-9'>
												<input
													type="email"
													id="Mail"
													value={form.Mail}
													onChange={(e) => formChange({ "Mail": e.target.value })}
													name="Mail"
													autoComplete="username"
													className="form-control" />
											</div>
										</div>
										<div className='row mb-3'>
											<label className="col-sm-3 col-form-label" htmlFor='Password'>Password</label>
											<div className='col-sm-9'>
												<input
													type="password"
													id="Password"
													value={form.Password}
													onChange={(e) => formChange({ "Password": e.target.value })}
													onKeyUp={(e) => handleKeyUP(e.key)}
													name="Password"
													autoComplete="current-password"
													className="form-control" />
											</div>
										</div>
										<div>
											<div className="container">
												<div className="row">
													<button
														className="btn btn-primary"
														onClick={() => postLogin()}
														type="button">
														Login
													</button>
													<Link
														onClick={() => setBox("resetpassword")}
														to=""
														className='py-3 text-end'>Olvidé mi password</Link>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						}
						{
							box === "resetpassword" &&
							<div className="card shadow">
								<div className="card-header">
									<h4>Recuperar Contraseña</h4>
								</div>
								<div className="card-body text-center">
									<form className="form" id="formLogin">
										<p>Ingrese su dirección de mail y le enviaremos los pasos para recuperar la nueva password.</p>
										<div className="form-outline">
											<label className="form-label" htmlFor='Mail'>Email</label>
											<input
												type="email"
												id="MailReset"
												value={form.MailReset}
												onChange={(e) => formChange({ "MailReset": e.target.value })}
												name="Mail"
												autoComplete="username"
												className="form-control" />
										</div>
										<div className="form-outline">
											<div className="container">
												<div className="row">
													<button
														className="btn btn-primary"
														onClick={() => postRestePassword()}
														type="button">
														Recuperar
													</button>
													<Link
														onClick={() => setBox("login")}
														to=""
														className='py-3 text-end'>Volver</Link>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						}
					</div>
				</div>

			</section>
			<Loading contador={contadorLoading} />
		</>
	)
}

export default Login;