import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
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
                                <div className="mb-0 px-6 py-6 grid bg-blueGray-200">
                                    <label for="email" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                                    <input name="email" type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="john.doe@email.com" ></input>
                                </div>
                                <div className="mb-0 px-6 grid bg-blueGray-200">
                                    <label for="password" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Password</label>
                                    <input name="password" type="password" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="password" ></input>
                                </div>
                                <div className="rounded-b mb-0 px-6 py-6 bg-blueGray-200">
                                    <button className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150" type="button">Sign In</button>
                                </div>
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