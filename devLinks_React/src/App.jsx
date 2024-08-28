import Navbar from "./components/Navbar.jsx"
import Phoneview from "./components/Phoneview.jsx"
import Personal from "./components/Personal-info.jsx"
import Preview from "./components/Preview.jsx"

import Links from "./components/links.jsx"
import { Outlet } from "react-router-dom"
import { useEffect } from "react"

const App=()=>{
  return (
    <>
     <Navbar/>
     <main className=" mt-4 mx-4 max-w-full p-4 bg-white rounded shadow">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Phoneview/>
         <Outlet/>
     </div>
     </main> 
        </>
  )
}
export default App