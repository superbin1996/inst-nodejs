import { Navigate } from "react-router-dom"
import { useAppContext } from "../context/appContext"
import { useLocation} from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const { user } = useAppContext()
  if (!user && location.pathname === '/') {
    return <Navigate to='/register' />
  }
  return (
    children
  )
}
export default ProtectedRoute