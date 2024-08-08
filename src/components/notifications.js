import React,{useContext} from 'react'
import { SocketContext } from '../SocketContext'
import './style.css'



const Notifications = () => {
const {answerCall,call,callAccepted} = useContext(SocketContext)



  return (
    <div >
      
      {call.isReceivedCall && !callAccepted && (

        <div className='notification-call'>
          <h1>{call.name} is calling...</h1>
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