import React from 'react'
import MainPanel from '../../comp/MainPanel/MainPanel'

const AdminDash = () => {
  return (
    <>
    <MainPanel   
    title="Admin Dashboard"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Admin Dashboard" },
        ]}
    >
        
    </MainPanel>
      
    </>
  )
}

export default AdminDash
