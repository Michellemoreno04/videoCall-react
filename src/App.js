import React, { useState,useEffect } from 'react'
import VideoPlayer from './components/videoPlayer'
import './App.css'
import { Navbar } from './components/nabvar/nabvar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/home'
import Login from './firebase/auth'
import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { appFirebase } from './firebase/firebase'
import UsersList from './components/User_list/userList'
import UserProfile from './components/User_list/user_profile/userProfile'
import Chat from './components/chatComponent/chat'

const auth = getAuth(appFirebase);


function App({userEmail}) {


  return (
    <div className='container' >
      
      <Navbar/>
      
      <div className='chatAndVideoPlayer'>
      <VideoPlayer userEmail={userEmail}/>
      <Chat />
      </div>
        
        
    </div>

  )
}

//aqui vienen las rutas y login del usuario
export const Rutas = () => {
  const [usuario, setUsuario] = useState(null);// Inicialmente null para manejar la carga
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(true);
        setUserEmail(user.email); // Guardar el correo electrónico del usuario
      } else {
        setUsuario(false);
        setUserEmail(''); // Limpiar el estado si no hay usuario
      }
    });

    return () => unsubscribe(); // Cleanup al desmontar el componente
  }, []);

  if (usuario === null) {
    // Mientras se carga la autenticación, mostrar un indicador de carga
    return  (<div className="spinner">
      <span></span>
      <span></span>
      <span></span>
</div>
)
}

  return (
    <div>
    
     <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/videoChat' element={usuario ? <App userEmail={userEmail} /> : <Login/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/usersList' element={<UsersList/>} />
          <Route path='/profile/:uid' element={<UserProfile/>} />
          
        </Routes>
      </Router>
    </div>
  )
}
export default App
