import React, { useContext, useState } from "react";
import { SocketContext } from "../SocketContext";
import CopyToClipboard from "react-copy-to-clipboard";
import Swal from "sweetalert2";


const Options = ({ children }) => {
  const { me, callAccepted, callEnded, leaveCall, nextCall,callUser,idTocall } = useContext(SocketContext);

  return (
    <div className="call-info">
      <div className="make-call">
        {callAccepted && !callEnded ? (
          
          <button onClick={nextCall} className="btnHangUp">Next</button>
        ) : (
          <button onClick={() => callUser(idTocall)} className="btnCall">Start</button>
        )}
      </div>
      {children}
    </div>
  );
};

export default Options;
