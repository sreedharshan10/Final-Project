import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import LoginPage from './login_page/login_page.jsx'
import NotFoundPage from './not_found_page/not_found_page.jsx';
import AdminLanding from './landing_page/admin_landing.jsx';
import ResetPassword from './password_reset/password_reset.jsx';
import Dashboard1 from './dashboard/dashboard.jsx';
import Dashboard2 from './dashboard_user/user_dashboard.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/User/:userId',
    element: <Dashboard2 />,
    
  },
  {
    path:'/Admin',
    element: <AdminLanding/>,
  },
  {
    path: '/Reset-password/:userId',
    element: <ResetPassword/>,
  },
  {
    path: '/Dashboard',
    element: <Dashboard1/>,
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
