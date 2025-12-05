import React from 'react'
import useAuth from '../hooks/useAuth'
import useRole from '../hooks/useRole'
import Home from '../pages/Home/Home/Home'

function AdminRoute({children}) {

  const { loading} = useAuth()
  const {role, roleLoading} = useRole()
  if (loading || roleLoading) {
    return <h1>Loading.....</h1>
  }

  if(role !== 'admin'){
    return <h3>You are forbidden to access this page</h3>
  }

  return children
}

export default AdminRoute