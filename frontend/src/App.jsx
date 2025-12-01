import React from 'react'
import { Navbar } from 'flowbite-react'
import Home from './pages/Home.jsx'
import Dmm_Template from './pages/Dmm_Template.jsx'
import TemplateManagement from './pages/Template_Management.jsx'
import Header from './components/Header.jsx'
import Uut from './pages/Uut.jsx'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

const App = () => {
  return (
     <BrowserRouter>
     <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dmm_template' element={<Dmm_Template />} />
        <Route path='/template_management' element={<TemplateManagement />} />
        <Route path='/uut' element={<Uut />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App