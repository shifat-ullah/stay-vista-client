import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from './useAxiosSecure'
import useAuth from './useAuth'
const useRole = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure()
  // console.log(user)

  const { data: role = '', isLoading } = useQuery({
    queryKey: ['role', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure(`/user/${user?.email}`)
      return data.role
    },
    
  })


  //   Fetch user info using logged in user email

  return [role, isLoading]
}

export default useRole