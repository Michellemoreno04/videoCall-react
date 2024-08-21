import React, { useState } from 'react';
import './auth.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut,
    signInWithPopup,
    GoogleAuthProvider
 } from 'firebase/auth';
import { appFirebase } from './firebase'
import { Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';


const auth = getAuth(appFirebase);



const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrado, setRegistrado] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    // Aquí puedes manejar la autenticación
    if (registrado) {
      try {
      // Registrar nuevo usuario
     const  userCredential = await createUserWithEmailAndPassword(auth, email, password)
       // Guardar la información del nuevo usuario en Firestore
       await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email, // Puedes usar el email como nombre si no tienes un nombre
        photoURL: userCredential.user.photoURL || '', // Dejar vacío si no hay foto
      });
      } catch (error) {
        alert('asegurese de que la contraseña contenga al menos 6 caracteres');
      }
       
    } else {
      try {
        //aqui se inicia sesion
   const  userCredential =  await signInWithEmailAndPassword(auth, email, password)

         // (Opcional) Si deseas actualizar la información del usuario en Firestore al iniciar sesión, puedes hacerlo aquí
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          lastLogin: new Date(), // Puedes agregar más campos si es necesario
        }, { merge: true }); // El { merge: true } asegura que no se sobrescriba la información existente

       
      } catch (error) {
        alert('Credenciales incorrectas');
      }
       
    }
  }

 
  return (
    <div className='login-page'>
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={signIn}>
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            placeholder='example@ex.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder='*******'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit"  className="btn-login">{registrado ? 'Registrate' : 'Iniciar Sesion'}</button>
      </form>
      {/*buton de google */}
      
<button className="button-google" onClick={googleSignIn}>
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
</svg>
  Continue with Google
</button>
      <h4>¿No tienes una cuenta?</h4>
     <Link to={'#'}> <button className="btn-login" onClick={() => setRegistrado(!registrado)}>{ registrado ? 'Iniciar Sesion' : 'Registrate'}</button></Link>
    </div>
    </div>
  );
};

  //funcion para cerrar sesion
  export const logout = async (e) => {
    const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
    

  }
// sign in with google
  export const googleSignIn = async (e) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      // Guardar la información del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    })
    .catch((error) => {
      console.error(error);
    });
    
}
export default Login;
