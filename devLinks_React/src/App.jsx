import Navbar from "./components/Navbar.jsx"
import Phoneview from "./components/Phoneview.jsx"
// import Personal from "./components/Personal-info.jsx"
// import Preview from "./components/Preview.jsx"

// import Links from "./components/links.jsx"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect,useState} from "react"
const BASE_URL = import.meta.env.VITE_BASE_URL;
const App=()=>{
  const navigate =useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    console.log("calling the API");

    fetch(`${BASE_URL}/api/v1`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          console .log("Data authenticate check");
          if (!data.isAuthenticated) {
            setIsAuthenticated(true);
            navigate("/"); // User is authenticated, navigate to the main app route
          } else {
            console.log("not authneticate")
            navigate("/login"); // User is not authenticated, redirect to login
          }
        } else {
          throw new Error('Failed to authenticate');
        }
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
        navigate("/login"); // On error, redirect to login
      });
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Return null to avoid rendering the app while checking authentication
  }
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