import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Statistics from '../components/Dashboard/Common/Statistics'
import MyListing from '../components/Dashboard/User/Host/MyListing'
import AddRoom from '../components/Dashboard/User/Host/AddRoom'
import Profile from '../components/Dashboard/Common/Profile'
import ManageUsers from '../components/Dashboard/User/Admin/ManageUsers'
import AdminRoute from './AdminRoute'
import HostRoute from './HostRoute'
import MyBookings from '../components/Dashboard/User/Guest/MyBookings'
import ManageBookings from '../components/Dashboard/User/Host/ManageBookings'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <PrivateRoute><RoomDetails /></PrivateRoute>,
      },
    ],
  },
  {
    path:'/dashboard',
    element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children:[
      {
        index:true,
        element:<PrivateRoute><Statistics></Statistics></PrivateRoute>
      },
      {
        path:'add-room',
        element:<PrivateRoute><HostRoute><AddRoom></AddRoom></HostRoute></PrivateRoute>
      },
      {
        path:'my-listings',
        element:<PrivateRoute><HostRoute><MyListing></MyListing></HostRoute></PrivateRoute>
      },
      {
        path:'manage-users',
        element:<PrivateRoute><AdminRoute><ManageUsers></ManageUsers></AdminRoute></PrivateRoute>
      },
      {
        path:'profile',
        element:<PrivateRoute><Profile></Profile></PrivateRoute>
      },
      {
        path:'my-bookings',
        element:<PrivateRoute><MyBookings/></PrivateRoute>
      },
      {
        path:'manage-bookings',
        element:<PrivateRoute><HostRoute><ManageBookings/></HostRoute></PrivateRoute>
      },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
])
