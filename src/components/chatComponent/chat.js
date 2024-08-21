import React, { useState, useContext,useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import './chat.css'

 const Chat = () => {
    const { messages,setMessages, sendMessage,socket} = useContext(SocketContext);
    const [message, setMessage] = useState('');
   
    const handleSubmit = (e) => {
      e.preventDefault();
      if (message.trim()) {//trim() en JavaScript se usa para eliminar los espacios en blanco del principio y el final de una cadena de texto. 
        sendMessage(message);
        setMessage('');
      }
      
    };

    useEffect(() => {
        const handleNewMessage = (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        };
      
        // Escuchar el evento de recibir mensajes
        socket.on('receiveMessage', handleNewMessage); // Cambiado a 'receiveMessage'
      
        return () => {
          // Limpiar el evento cuando el componente se desmonte
          socket.off('receiveMessage', handleNewMessage);
        };
      }, [setMessages]);
      
      
    return (
      <div className='chat-container'>
        <HeadChat/>
        <div className='messages-container'>
          {messages.map((texMessage, index) => (
            <div key={index} className='message'>
              <strong>{texMessage.id}: </strong>
              <span>{texMessage.text}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className='input-container'>
          <input
            type="text"
            className='input-chat'
            placeholder='Escribe tu mensaje'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className='btn-chat'>Enviar</button>
        </form>
      </div>
    );
  };
  

  export const HeadChat = () => {
const { nextCall } = useContext(SocketContext);
    const handleStartClick = () => {
      nextCall(); // Llamar a callUser cuando se hace clic en el botón "Start"
    };
    return (
      <div className='head-chat'>
        <button className='btn-start' onClick={handleStartClick}>Next</button>
        <button className='btn-stop'>Stop</button>
      </div>
    );
  };
  export default Chat;