import React, { useContext, useState } from "react";
import { SocketContext } from "../SocketContext";
import CopyToClipboard from "react-copy-to-clipboard";
import Swal from "sweetalert2";


const Options = ({ children }) => {
  // el children viene siendo el componente de Notification
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser,llamando,setLlamando} = useContext(SocketContext);
  const [idTocall, setIdTocall] = useState("");
 



  return (
    <div className="call-info">


    <div className="account-info">
    <p>Ingresa tu nombre</p>
      <input
        label="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder=" Nombre"
        className="inputName"
      />
      
      
      <CopyToClipboard text={me}>
        <button className="btnCall">Copy your id</button>
      </CopyToClipboard>
      </div> 
     
      <div className="make-call">
       
        
        <p>Ingresa el ID</p>
        <input
          label="ID to Call"
          value={idTocall}
          onChange={(e) => setIdTocall(e.target.value)}
          className="inputId"
          placeholder="ID to call"
          
        />
        
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall} className="btnHangUp">hang up</button>
        ) : (
          <button onClick={() => callUser(idTocall)}  className="btnCall">Make a Call</button>
        )}
      </div>
      
      {children}
     
    </div>
  );
};

export default Options;
