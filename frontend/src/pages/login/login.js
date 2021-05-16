import React, { Component } from 'react';
import { loginService } from '../../services/authServices';
import Swal from 'sweetalert2';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            isLoading: false,
            errors: {}
        }
    }

    doLogin = async (event) => {
        event.preventDefault();

        this.setState({
            ...this.state, isLoading: true
        })

        const sendLogin = await loginService(this.state.email, this.state.password);

        if(sendLogin.error){
            const errors = sendLogin.response.data
            if(errors.errors){
                Object.keys(errors.errors).map(val => {
                    console.log({[val]: errors.errors[val]})
                    return this.setState({
                        errors: {...this.state.errors, [val]: errors.errors[val]}
                    })
                })
            }else{
                console.log(errors)
                return Swal.fire({
                    icon: 'error',
                    title: 'Oops',
                    text: errors.message
                }).then(() => {
                    return this.setState({
                        isLoading: false
                    })
                })
            }

            return this.setState({
                isLoading: false
            })
        }

        return (window.location.href = '/home');
    }

    handleInput = (event) => {
        return this.setState({
            ...this.state, [event.target.name]: event.target.value,
            errors: {
                ...this.state.errors, [event.target.name]: null
            }
        })
    }

    render() { 
        return (<main>
            <section className="absolute h-full w-full bg-bluekegreyish">
                <div className="container mx-auto px-4 h-full">
                    <div className="flex content-center items-center justify-center h-full">
                        <div className="w-full lg:w-4/12 px-4">
                            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg border-0">
                                <div className="rounded-t mb-0 px-6 pt-3 bg-blueGray-200">
                                    <div className="text-center">
                                        <img alt="hortifarm-logo" className="mx-auto w-32" src="https://lb-hortifarm.com/images/logo_lbh20_200.png"></img>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl">Hortifarm BI</h3>
                                    </div>
                                </div>
                                <form>
                                    <div className="mb-0 px-6 py-6 grid bg-blueGray-200">
                                        <label htmlFor="email" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                                        <input onChange={(e) => this.handleInput(e)} required name="email" type="email" className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ${(this.state.errors && this.state.errors.email) ? "ring ring-red-600" : ""} w-full ease-linear transition-all duration-150`} placeholder="john.doe@email.com" ></input>
                                        {(this.state.errors && this.state.errors.email) && <label className="text-red-500 text-xs mt-2 duration-150">{this.state.errors.email}</label>}
                                    </div>
                                    <div className="mb-0 px-6 grid bg-blueGray-200">
                                        <label htmlFor="password" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Password</label>
                                        <input onChange={(e) => this.handleInput(e)} required name="password" type="password" className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ${(this.state.errors && this.state.errors.password) ? "ring ring-red-600" : ""} w-full ease-linear transition-all duration-150`} placeholder="password" ></input>
                                        {(this.state.errors && this.state.errors.password) && <label className="text-red-500 text-xs mt-2 duration-150">{this.state.errors.password}</label>}
                                    </div>
                                    <div className="rounded-b mb-0 px-6 py-6 bg-blueGray-200">
                                        {
                                            this.state.isLoading ? 
                                            <button onClick={(e) => this.doLogin(e)} disabled className="bg-gray-400 bg-opacity-40 text-gray-600 cursor-not-allowed text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150" type="submit">Loading...</button> :
                                            <button onClick={(e) => this.doLogin(e)} className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150" type="submit">Sign In</button>
                                        }
                                    </div>
                                </form>
                            </div>
                            <div className="flex flex-col w-full">
                                <h5 className="text-xs mx-auto text-blueGray-100"><b>Hortis</b> : Hortifarm Information System</h5>
                                <h5 className="text-xs mx-auto text-blueGray-100">© 2021, TIM soft</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>);
    }
}

export default Login;