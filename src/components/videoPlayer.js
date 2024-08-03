import React,{useEffect}from 'react'
import './style.css'
import { useContext } from 'react'
import { SocketContext } from '../SocketContext'
import { Toaster,toast } from 'sonner';
import '../App.css'



const VideoPlayer = ({children}) => {
const {name,myVideo,userVideo,call,llamando,setLlamando,callAccepted} = useContext(SocketContext) //aqui destruturamos todo lo que viene de socketcontext

useEffect(() => {
    if (callAccepted) {
        setLlamando('');
        
        toast.dismiss()
    }
}, [callAccepted, setLlamando]); // Se ejecuta cuando callAccepted cambia





  return (
    <div className='video-container'>
        <Toaster theme='dark'/>
<div >

<video   playsInline muted ref={myVideo} autoPlay className='myVideo'  />
<p>{name}</p>

</div>
<div >
    {/*user video */}
    
<video  playsInline  muted ref={userVideo}   autoPlay  className='userVideo'  />


{children}


{llamando && !callAccepted &&(
            toast.loading('LLAMANDO...',)
)}
</div>
    </div>
    )
}

export default VideoPlayer;