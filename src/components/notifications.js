import React,{useContext} from 'react'
import { SocketContext } from '../SocketContext'
import './style.css'



const Notifications = () => {
const {answerCall,call,callAccepted} = useContext(SocketContext)



  return (
    <div >
      
      {call.isReceivedCall && !callAccepted && (

        <div className='notification-call'>
          <p className='caller-name'>{call.name}Fulano is calling...</p>
          <p>Notification...</p>
          <button onClick={answerCall} className='btnCall'>
            Answer
          </button>
        </div>
      )}
    </div>
  )
}

export default Notifications