import React from 'react'
import {FireFilled} from '@ant-design/icons';
import logo from '../images/logo.png'
import './sidebar.css';

const Logo = () => {
  return (
    <div className='logo'>
      <img src={logo} />         
    </div>
  )
}

export default Logo