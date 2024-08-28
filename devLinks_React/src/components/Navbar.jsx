import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
const Navbar=()=>{
    return (
        <>
         <nav className="sticky top-1 z-10 bg-white border rounded  max-h-12 p-2  mb-2 mx-4  flex justify-between ">
          <div className="mx-2 flex gap-1" >
              <div className="bg-blue-800 max-w-8 max-h-8 text-white p-1 rounded text-center  ">
              <FontAwesomeIcon icon="fa-solid fa-link" />
              </div>
             <p className="text-md sm:text-xl font-bold ">devLinks</p>
         </div>
          <div className=" sm:space-x-2 ">
           <Link to="/"> 
            <button className=" tab-btn text-gray-900 bg-white focus:border-gray-300
            hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
            px-3 py-1.5 sm:text-hidden" >
            <i class="fa-solid fa-circle-user text-sm"></i>
            <span className="hidden sm:inline-block">Personal Info</span>
            </button>
           </Link>
     
          <Link to="/links">
            <button className=" tab-btn text-gray-900 bg-white focus:border-gray-300
            hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
            px-3 py-1.5 "  >
            <i class="fa-solid fa-link text-sm"></i>
            <span className="hidden sm:inline-block">Links</span>
            </button>
          </Link>

          </div>
            <div className="mx-2">
            <Link to="/preview">
            <button className=" tab-btn text-gray-900 bg-white focus:border-gray-300
            hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm 
            px-3 py-1.5 " >
            <i class="fa-solid fa-link text-sm"></i>
            <span className="hidden sm:inline-block">Preview</span>
            </button>
            </Link>
            
          </div>
        </nav>
        </>
    )
}
export default Navbar