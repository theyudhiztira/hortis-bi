import React from 'react'
import Navigation from '../../components/navigation'
import {
    IoCubeOutline,
    IoArchiveOutline,
    IoCartOutline
} from 'react-icons/io5'
import apiCaller from '../../services/apiCaller'
import numeral from 'numeral'
import { Link } from 'react-router-dom'

const createAvatarUrl = (name) => {
    const splittedName = name.split(" ", 2)
    let character = "";

    splittedName.map(char => {
        return character+=char.charAt(0)
    })

    return character
}

const Home = () => {
  const [stateData, setData] = React.useState({"product":0,"transaction":0,"production":0})
  const [textReport, setTextReport] = React.useState({})
  React.useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await apiCaller.get('home')
        const report = await apiCaller.get('first-text-report')

        setTextReport(report.data)
        return setData(data.data)
      } catch (error) {
        return alert('Something is wrong please contact our team!')
      }
    }

    fetchHomeData()
  }, [])

    const userData = JSON.parse(localStorage.getItem('hortis_user'))

    let sectionStyle = "ml-0 bg-gray-100 min-h-screen h-auto"

    if(userData.role == "admin"){
        sectionStyle = "ml-0 md:ml-64 lg:ml-64 bg-gray-100 min-h-screen h-auto"
    }

    return (<>
        <div className="w-full h-full flex flex-col">
            <Navigation />
            <section className={sectionStyle}>
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
                    <div className="grid grid-cols-1 md:grid-cols-1 md:mt-10 mt-2">
                        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch my-2'>
                            <h2 className='text-lg font-bold'>Total Hari Ini</h2>
                            <div className='flex-grow flex'>
                            <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.hi).format('0,0.[00]') : 0}</h1>
                            </div>
                        </div>
                        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch my-2'>
                            <h2 className='text-lg font-bold'>Total Hari Kemarin</h2>
                            <div className='flex-grow flex'>
                            <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.yesterday).format('0,0.[00]') : 0}</h1>
                            </div>
                        </div>
                        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch my-2'>
                            <h2 className='text-lg font-bold'>Total Sampai Dengan Hari Ini</h2>
                            <div className='flex-grow flex'>
                            <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.sdhi).format('0,0.[00]') : 0}</h1>
                            </div>
                        </div>
                        <div className='bg-white rounded-md shadow-md p-3 flex flex-col items-stretch my-2'>
                            <h2 className='text-lg font-bold'>Total Sampai Dengan Bulan Ini</h2>
                            <div className='flex-grow flex'>
                            <h1 className='text-xl self-center'>Rp. {textReport.cardData ? numeral(textReport.cardData.sdbi).format('0,0.[00]') : 0}</h1>
                            </div>
                        </div>
                        <Link className='btn bg-blue-500 mt-2 p-3 font-bold text-white hover:bg-blue-600 rounded text-center' to='/report-new'>
                            Lihat Semua Laporan
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    </>)
}

export default Home