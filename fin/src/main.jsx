import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Chat from './Components/Chat.jsx'
import Layout from './Layout.jsx'
import Landing from './Components/Landing.jsx'
import Login from './Components/Login.jsx'
import SignUp from './Components/SignUp.jsx'


const router=createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"/",
        element:<Landing/>
      },
      {
        path:"/chat",
        element:<Chat/>
      },
      {
        path:"/login",
        element:<Login/>
      },
      {
        path:"/signUp",
        element:<SignUp/>
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
