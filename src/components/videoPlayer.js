import React, { useEffect} from "react";
import "./style.css";
import { useContext } from "react";
import { SocketContext } from "../SocketContext";
import { Toaster, toast } from "sonner";
import "../App.css";
import Notifications from "../components/notifications";
import { auth } from "../firebase/firebase";



const VideoPlayer = ({children,userEmail}) => {
  const { call, callAccepted, myVideo, userVideo, llamando, setLlamando,me } = useContext(SocketContext);
  

  
  useEffect(() => {
    if (callAccepted) {
      if (llamando) {
        toast.success("Llamada aceptada");
        setLlamando(false);
      }
      toast.dismiss();
    } else if (!callAccepted && llamando) {
      toast.loading("Conectando...");
    }
  }, [callAccepted, llamando, setLlamando]);


  return (
    <div className="video-container">

      <Toaster theme="dark" />

      
      <video playsInline muted ref={myVideo} autoPlay className="myVideo"/>

      <div>

      <div className="video-wrapper">
      

      { !callAccepted && !llamando ?(
//loader 
<div id="wifi-loader">
<svg className="circle-outer" viewBox="0 0 86 86">
    <circle className="back" cx="43" cy="43" r="40"></circle>
    <circle className="front" cx="43" cy="43" r="40"></circle>
    <circle className="new" cx="43" cy="43" r="40"></circle>
</svg>
<svg className="circle-middle" viewBox="0 0 60 60">
    <circle className="back" cx="30" cy="30" r="27"></circle>
    <circle className="front" cx="30" cy="30" r="27"></circle>
</svg>
<svg className="circle-inner" viewBox="0 0 34 34">
    <circle className="back" cx="17" cy="17" r="14"></circle>
    <circle className="front" cx="17" cy="17" r="14"></circle>
</svg>
<div className="text" data-text="Waiting Connection"></div>
</div>


      ):(
<Notifications />
        
      )
        
      }
     
      <video playsInline muted ref={userVideo} autoPlay className="userVideo"/>
      

      </div>
      
      
      </div>
      
{children}
   
    </div>
  );
};

export default VideoPlayer;
