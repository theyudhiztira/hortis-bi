import React, { useState } from 'react'
import { 
    IoReorderThree,
    IoHomeOutline,
    IoCloseOutline,
    IoBarChartOutline,
    IoCartOutline,
    IoPeopleOutline,
    IoPower
} from 'react-icons/io5'
import { logoutService } from '../services/authServices';
import {
    Link
} from 'react-router-dom'

const doLogout = (e) => {
    e.preventDefault();
    
    logoutService();

    return (window.location.href = '/login');
}

const Navigation = (props) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    return (
        <nav className={`md:left-0 md:top-0 ${!props.isFlex && 'md:block md:fixed'} md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6`}>
            <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent" type="button"><IoReorderThree /></button>
                <img className="hidden md:block w-20 mx-auto" alt="hortis logo" src="https://lb-hortifarm.com/images/logo_lbh20_200.png"></img>
                <Link className="md:hidden text-left md:pb-2 text-blueGray-600 mx-auto inline-block whitespace-nowrap text-sm uppercase font-bold px-0" to="/home">Hortis BI</Link>
                <div className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded py-3 px-6 md:py-0 md:px-0 ${showMobileMenu ? 'bg-white m-2' : 'hidden'}`}>
                    <div className="md:min-w-full md:hidden block border-blueGray-200">
                        <div className="flex flex-wrap">
                            <div className="w-6/12"><Link to="/home" className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">Hortis BI</Link></div>
                            <div className="w-6/12 flex justify-end">
                                <button onClick={() => setShowMobileMenu(!showMobileMenu)} type="button" className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"><IoCloseOutline /></button>
                            </div>
                        </div>
                    </div>
                    <hr className="my-4 md:min-w-full" />
                    <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                        <li className="items-center flex-row">
                            <Link to="/home" className="select-none cursor-pointer flex hover:bg-gray-600 text-xs uppercase py-3 px-2 rounded-md hover:text-gray-50 font-bold text-lightBlue-500 hover:text-grey-600 transition-all duration-150"><IoHomeOutline className="flex mr-2 text-sm opacity-75" /> Dashboard</Link>
                        </li>
                        <li className="items-center flex-row">
                            <Link to="/report-new" className="select-none cursor-pointer flex hover:bg-gray-600 text-xs uppercase py-3 px-2 rounded-md hover:text-gray-50 font-bold text-lightBlue-500 hover:text-grey-600 transition-all duration-150"><IoBarChartOutline className="flex mr-2 text-sm opacity-75" /> Laporan</Link>
                        </li>
                        <li className="items-center flex-row">
                            <Link to="/transaction-new" className="select-none cursor-pointer flex hover:bg-gray-600 text-xs uppercase py-3 px-2 rounded-md hover:text-gray-50 font-bold text-lightBlue-500 hover:text-grey-600 transition-all duration-150"><IoCartOutline className="flex mr-2 text-sm opacity-75" /> Transaksi</Link>
                        </li>
                        <li className="items-center flex-row">
                            <Link to="/user" className="select-none cursor-pointer flex hover:bg-gray-600 text-xs uppercase py-3 px-2 rounded-md hover:text-gray-50 font-bold text-lightBlue-500 hover:text-grey-600 transition-all duration-150"><IoPeopleOutline className="flex mr-2 text-sm opacity-75" /> Users</Link>
                        </li>
                    </ul>
                    <ul className="md:flex-col md:min-w-full flex flex-col md:absolute list-none bottom-0">
                        <li className="items-center flex-row">
                            <span onClick={(e) => doLogout(e)} className="select-none flex cursor-pointer hover:bg-gray-600 hover:text-grey-600 px-2 text-xs uppercase py-3 rounded font-bold text-lightBlue-500 hover:text-gray-50 transition-all duration-150"><IoPower className="flex mr-2 text-sm opacity-75 text-red-600" /> Logout</span>
                        </li>
                        <hr />
                        <li className="items-center flex-col mt-3 text-center">
                            <span className="self-auto text-xs mx-auto text-black-800 text-center w-full">Hortifarm Information System</span><br />
                            <span className="self-auto text-xs mx-auto text-black-800 text-center w-full">© 2021, TIM soft</span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navigation