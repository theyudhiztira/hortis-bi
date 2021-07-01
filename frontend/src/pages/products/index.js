import React, { Component } from 'react'
import Navigation from '../../components/navigation'
import CategoryManager from './category'

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeStatus: 1
    }
  }
  render() { 
    return (
      <>
        <div className='w-full h-full flex flex-col'>
          <Navigation />
            <section className="ml-0 md:ml-64 bg-gray-100 min-h-screen h-auto">
                <div className="container mx-auto px-10 py-7 md:py-16 md:px-16">
                  <div className='mx-auto mb-3'>
                    <h1 className='font-semibold text-2xl'>Products</h1>
                  </div>
                  <div className="mx-auto flex items-center justify-center w-full mb-2">
                    <ul className="w-full hidden md:flex items-center p-2 border-b border-gray-200 bg-white rounded-xl shadow-sm">
                        <li onClick={() => this.setState({activeStatus: 1})} className={this.state.activeStatus === 1 ? "w-6/12 text-center py-2 px-4 cursor-pointer bg-indigo-100 rounded text-xs xl:text-sm leading-none text-center text-indigo-700" : "w-6/12 text-center py-2 px-4 cursor-pointer bg-transparent hover:bg-indigo-50 rounded text-xs xl:text-sm leading-none text-gray-600"}>
                            Category Manager
                        </li>
                        <li onClick={() => this.setState({activeStatus: 2})} className={this.state.activeStatus === 2 ? "w-6/12 text-center py-2 px-4 cursor-pointer bg-indigo-100 rounded ml-2  text-xs xl:text-sm leading-none text-center text-indigo-700" : "w-6/12 text-center py-2 px-4 cursor-pointer ml-2 bg-transparent hover:bg-indigo-50 rounded text-xs xl:text-sm leading-none text-gray-600"}>
                            SKU Manager
                        </li>
                    </ul>
                    <div className="md:hidden relative w-full mx-auto bg-white rounded mb-1">
                        <div className="absolute inset-0 m-auto mr-4 z-0 w-6 h-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-selector" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#A0AEC0" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <polyline points="8 9 12 5 16 9" />
                                <polyline points="16 15 12 19 8 15" />
                            </svg>
                        </div>
                        <select aria-label="Selected tab" className="form-select block w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent relative z-10" value={this.state.activeStatus} onChange={(element) => this.setState({activeStatus: parseInt(element.target.value)})}>
                            <option value={1} className="text-sm text-gray-600">
                                Category Manager
                            </option>
                            <option value={2} className="text-sm text-gray-600">SKU Manager </option>
                        </select>
                    </div>
                  </div>
                  {this.state.activeStatus === 1 && <CategoryManager />}
                </div>
            </section>
        </div>
      </>
    );
  }
}

export default Products;