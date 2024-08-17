import React from 'react'
import '../nabvar/nabvar.css'
import { Select } from '@chakra-ui/react'
import { useContext } from 'react'
import { SocketContext } from '../../SocketContext' 
import { Chat } from '../chatComponent/chat'



export const Navbar = () => {
  const {nextCall} =useContext(SocketContext);
  

  const handleStartClick = () => {
    nextCall(); // Llamar a callUser cuando se hace clic en el botón "Start"
  };

  return (
    <div className='navbar-container'>

<nav className='navbar'>
<div className='btn-control'>
<button className='btn-start' onClick={handleStartClick}>Next</button>
<button className='btn-stop'>Stop</button>
</div>

<div className='gender-content'>
<Select placeholder='Select Gender' color={'white'}>
  <option value='option1'>Masculino</option>
  <option value='option2'>Femenino</option>
  <option value='option3'>Otros...</option>
</Select>


<div className='country'>
<Select placeholder='Country:All' color={'white'}>
  <option value='option1'>Optiones...</option>
  <option value='option2'>Optiones...</option>
  <option value='option3'>Optiones...</option>
</Select>
</div>

</div> 
    </nav>
    <HeadChat />
    <Chat />
    </div>
  )
}





export const HeadChat = () => {
  return (
    <div className='head-chat'>
      <h2>ChatRoom</h2>
    </div>
  )
}
