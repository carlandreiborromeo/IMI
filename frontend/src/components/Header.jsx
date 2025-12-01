import React from 'react'
import { Navbar } from 'flowbite-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
        <Navbar fluid={true}>
            <Link to="/" className="mr-4 hover:underline">Home</Link>
            <Link to="/template_management" className="mr-4 hover:underline">Template_Management</Link>
            <Link to="/dmm_template" className="mr-4 hover:underline">Dmm_Template</Link>
            <Link to="/uut" className="mr-4 hover:underline">Uut</Link>
        </Navbar>
    </div>
  )
}

export default Header