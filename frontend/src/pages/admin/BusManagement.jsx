import React from 'react'
import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import MainContent from '../../components/admin/BusManagement'
import './Dashboard.css'

function App() {    
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}

export default App
