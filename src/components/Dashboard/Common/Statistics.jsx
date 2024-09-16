import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import useRole from '../../../hooks/UseRole'
import AdminStatistics from '../User/Admin/AdminStatistics'
import GuestStatistics from '../User/Guest/GuestStatistics';
import HostStatistics from './../User/Host/HostStatistics';


const Statistics = () => {
  const [role, isLoading] = useRole()
  if (isLoading) return <LoadingSpinner />
  return (
    <>
      {role === 'admin' && <AdminStatistics />}
      {role === 'host' && <HostStatistics />}
      {role === 'guest' && <GuestStatistics />}
    </>
  )
}

export default Statistics