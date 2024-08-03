import { createContext,useState,useEffect,useRef,} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

//window.global = window;//Polyfill para global:Una solución es definir la variable global en tu aplicación del navegador para que el código pueda ejecutarse sin errores.


// aqui se crea el contexto de socket
const SocketContext = createContext()
// io client se conecta al servidor
const socket = io('http://localhost:5000')

const ContextProvider = ({children})=>{
const [stream, setStream] = useState(null)
const [me,setMe] = useState('')
const [call, setCall] = useState({})
const [callAccepted,setCallAccepted] = useState(false)
const [callEnded,setCallEnded] = useState(false)
const [name,setName] = useState('')
const [llamando,setLlamando] = useState(false)


const myVideo = useRef()
const userVideo = useRef()
const connectionRef = useRef()



useEffect(() =>{ 

    //here we ask for the permition to get the video and audio
  navigator.mediaDevices.getUserMedia({video:true, audio:true})
.then((currentStream)=>{
setStream(currentStream);
if (myVideo.current) {
  // aqui configuramos la refeencia de myvideo
myVideo.current.srcObject = currentStream;
}
})



//aqui se pasa el id que nos dA el servidor
socket.on('me',(id)=>{setMe(id)})
//aqui se pasa la data a servidor
socket.on('calluser',({from,name:callerName,signal})=>{
setCall({isReceivedCall:true, from, name: callerName,signal})
  

})



}, [])



useEffect(() => {
  if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
  }
}, [stream]);



//respond Call
   const answerCall  = () =>{
    setCallAccepted(true)
    
// aqui se crea una nueva instacia de peer  (usando la biblioteca simple-peer)
const peer = new Peer({initiator:false , trickle:false, stream,}) // trickle: false: Desactiva el envío de candidatos ICE de forma continua. Esto significa que todos los candidatos ICE se enviarán en un solo bloque.
 //signal viene siendo la señalisacion
peer.on('signal',(data)=>{
    socket.emit('answercall',{signal:data, to: call.from})
  })
// Este evento se dispara cuando se recibe un flujo de medios desde el otro peer.
  peer.on('stream',(currentStream)=>{
      // aqui configuramos la refeencia de myvideo
    userVideo.current.srcObject = currentStream;
      
     
  })

   peer.signal(call.signal)

//aqui ponemos la referencia a la instacia o persona connectada
   connectionRef.current = peer;
}


  const callUser  = (id) =>{
    if(!id){
      alert("ingresa un id correcto")
    }else{
      setLlamando(true)
    }

    
    const peer = new Peer({initiator:true , trickle:false, stream}) // trickle: false: Desactiva el envío de candidatos ICE de forma continua. Esto significa que todos los candidatos ICE se enviarán en un solo bloque.
 //signal viene ciendo la señalisacion
 peer.on('signal',(data)=>{
    socket.emit('calluser',{userToCall: id, signalData: data, from: me, name})
  
  })
// Este evento se dispara cuando se recibe un flujo de medios desde el otro peer.
  peer.on('stream',(currentStream)=>{
    userVideo.current.srcObject = currentStream;
  })
// aqui aceptamos la llamada
  socket.on('callAccepted',(signal)=>{
    setCallAccepted(true)

    peer.signal(signal)
    console.log('Caller call accepted, signal:', signal);
  })
//aqui la coneccion de referecia va hacer igual a peer
    connectionRef.current = peer;

  
   }


//aqui se cuelga la llamada
   const leaveCall  = () =>{

    setCallEnded(true)

    connectionRef.current.destroy()

    window.location.reload() // refresca la web
   }
  
return(
    //todo lo que se ponga hay va a hacer global y accesible para todo el codigo
    <SocketContext.Provider value={{ call, callAccepted, myVideo, userVideo, stream, name,setName, callEnded, me, callUser, leaveCall, answerCall,llamando,setLlamando }}>
         {children}
    </SocketContext.Provider>
)

}

export {ContextProvider, SocketContext};