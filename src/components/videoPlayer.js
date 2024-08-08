import React, { useEffect } from 'react';
import './style.css';
import { useContext } from 'react';
import { SocketContext } from '../SocketContext';
import { Toaster, toast } from 'sonner';
import '../App.css';

const VideoPlayer = ({ children }) => {
    const { name, myVideo, userVideo, llamando, setLlamando, callAccepted } = useContext(SocketContext);

    useEffect(() => {
        if (callAccepted) {
            setLlamando(false);
            toast.dismiss();
        }
    }, [callAccepted, setLlamando]);

    return (
        <div className='video-container'>
            <Toaster theme='dark' />
            <div>
                <video playsInline muted ref={myVideo} autoPlay className='myVideo' />
                <p>{name}</p>
            </div>
            <div>
                <video playsInline muted ref={userVideo} autoPlay className='userVideo' />
                {children}
                {llamando && !callAccepted && toast.loading('LLAMANDO...')}
            </div>
        </div>
    );
};

export default VideoPlayer;