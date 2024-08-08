import React, { useEffect, useState, useRef, createContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [llamando, setLlamando] = useState(false);
    const [pairedUser, setPairedUser] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
          
        });

        socket.on('me', (id) => { setMe(id); });

        socket.on('calluser', ({ from }) => {
            callUser(from);
        });
//aqui se resive la daata del sevidor para emparejar y llamar
        socket.on('paired', ({ userToCall, from }) => {
            setPairedUser(from === me ? userToCall : from);
        });

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
    }, []);

    useEffect(() => {
        if (myVideo.current && stream) {
            myVideo.current.srcObject = stream;
        }
    }, [stream]);

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
          console.log(data)
            socket.emit('answercall', { signal: data, to: call.from });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
            
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
    }

    const callUser = (id) => {
        setLlamando(true);
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
      
        //window.location.reload();
    }

    const nextCall = () => {
      setCallEnded(true);
      connectionRef.current.destroy();
      socket.emit('next');
  }

  useEffect(() => {
      if (pairedUser) {
          callUser(pairedUser);
      }
  }, [pairedUser]);



 

    return (
        <SocketContext.Provider value={{
            call, callAccepted, myVideo, userVideo, stream,
            name, setName, callEnded, me, callUser,
            leaveCall, answerCall, llamando, setLlamando,nextCall
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };
