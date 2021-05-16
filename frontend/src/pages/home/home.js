import React from 'react'
import Navigation from '../../components/navigation'
import {
    IoCubeOutline,
    IoPeopleOutline,
    IoCartOutline
} from 'react-icons/io5'

const createAvatarUrl = (name) => {
    const splittedName = name.split(" ", 2)
    let character = "";

    splittedName.map(char => {
        return character+=char.charAt(0)
    })

    return character
}

const Home = () => {
    const userData = JSON.parse(localStorage.getItem('hortis_user'))

    return (<>
        <div className="w-full h-full flex flex-col">
            <Navigation />
            <section className="ml-0 md:ml-64 bg-gray-100 min-h-screen h-auto">
                <div className="container px-10 py-8 mx-auto">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-start-1 col-span-6 p-5 text-center">
                            <div className="grid grid-cols-1 w-20 h-20 bg-gray-200 mx-auto mt-5 circle rounded-full">
                                <span className="place-self-center text-3xl font-bold select-none cursor-default">{createAvatarUrl(userData.full_name)}</span>
                            </div>
                            <h1 className="md:text-2xl pt-4 text-md">Welcome, {userData.full_name}</h1>
                            <div className="text-xs md:text-sm pt-2 text-gray-500">Manage your info and data to make Hortis Dashboard work better for you</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:mt-10 mt-2">
                        <div className="grid justify-items-stretch">
                            <div className="justify-self-center md:justify-self-end bg-gradient-to-tl from-purple-400 to-purple-600 grid grid-cols-3 lg:w-64 md:w-50 p-5 rounded-md h-24 shadow-lg mb-4">
                                <div className="col-span-2">
                                    <h1 className="place-self-center text-3xl text-white">100</h1>
                                    <b className="font-normal text-white">Products</b>
                                </div>
                                <div className="place-self-end">
                                    <IoCubeOutline className="text-white text-6xl" />
                                </div>
                            </div>
                        </div>
                        <div className="grid justify-items-stretch">
                            <div className="justify-self-center bg-gradient-to-tl from-green-400 to-green-600 grid grid-cols-3 lg:w-64 md:w-50 p-5 rounded-md h-24 shadow-lg mb-4">
                                <div className="col-span-2">
                                    <h1 className="place-self-center text-3xl text-white">100</h1>
                                    <b className="font-normal text-white">Transactions</b>
                                </div>
                                <div className="place-self-end">
                                    <IoCartOutline className="text-white text-6xl" />
                                </div>
                            </div>
                        </div>
                        <div className="grid justify-items-stretch">
                            <div className="justify-self-center md:justify-self-start bg-gradient-to-tl from-blue-400 to-blue-600 grid grid-cols-3 lg:w-64 md:w-50 p-5 rounded-md h-24 shadow-lg mb-4">
                                <div className="col-span-2">
                                    <h1 className="place-self-center text-3xl text-white">100</h1>
                                    <b className="font-normal text-white">Customers</b>
                                </div>
                                <div className="place-self-end">
                                    <IoPeopleOutline className="text-white text-6xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 md:mt-10 justify-items-stretch grid">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg justify-self-center w-full md:w-6/12">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Account Information
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Personal details information.
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                        Full name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {userData.full_name}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                        Role
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {String(userData.role).toUpperCase()}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                        Email address
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {userData.email}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                        Phone Number
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {userData.phone}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>)
}

export default Home