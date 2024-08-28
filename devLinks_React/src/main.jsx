import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Personal from './components/Personal-info.jsx';
import Links from './components/Links.jsx';
import Preview from './components/Preview.jsx';
import { createBrowserRouter,RouterProvider } from "react-router-dom";

const appRouter= createBrowserRouter([

  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Personal/>,
      },
      { 
        path:"/links",
        element:<Links/>,
      },
    ],
  },
  {
    path:"/preview",
    element:<Preview/>
  },
 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={appRouter}/>
  </StrictMode>,
)
