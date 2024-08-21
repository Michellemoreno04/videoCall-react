import React, { useEffect, useState, useRef, createContext } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [llamando, setLlamando] = useState(false);
  const [pairedUser, setPairedUser] = useState(null);
  const [messages, setMessages] = useState([]); // Para manejar los mensajes de chat

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("calluser", ({ from }) => {
      callUser();
    });

    socket.on("paired", ({ userToCall, from }) => {
      setPairedUser(from === me ? userToCall : from);
    });

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  //enviar mensaje al servidor
  const sendMessage = (message) => {
    const messageData = {
      id: me, // `me` es el ID del usuario que tienes en tu estado
      text: message,
      //to: pairedUser // es el id del usuario emparejado
    };
    // Agrega el mensaje al estado local antes de enviarlo
    setMessages((prevMessages) => [...prevMessages, messageData]);
    socket.emit("sendMessage", messageData); // Cambiado a 'sendMessage'
  };

  const [previousUser, setPreviousUser] = useState(null);

  // Se asegura de que el usuario empareja una vez que el estado de llamada cambie
  useEffect(() => {
    if (pairedUser !== previousUser && !callAccepted && !llamando) {
      // Actualizar previousUser antes de iniciar la nueva llamada
      setPreviousUser(pairedUser);
      callUser(pairedUser);
    }
  }, [pairedUser, callAccepted, llamando]);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  const callUser = (id) => {
    setLlamando(true);
    const peer = new Peer({ initiator: true, trickle: false, stream }); // tricklet: false envia todos los candidatos ice todo juntos

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
      console.log("usuarios emparejados: ", pairedUser);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      // Ordena las líneas "m=" en la respuesta SDP

      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
    callUser(pairedUser);
    // Notificar al servidor que este usuario está listo para una nueva llamada
    socket.emit("next");
  };

  const nextCall = () => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;

      // Notificar al servidor que estamos listos para la próxima llamada
      socket.emit("next");
    }

    // Reiniciar el estado de llamada
    setCallAccepted(false);
    setLlamando(false);

    // Llamar al método callUser con el nuevo usuario en espera
    const newUser = pairedUser;
    callUser(newUser);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        llamando,
        setLlamando,
        nextCall,
        messages,
        sendMessage,
        socket,
        setMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
