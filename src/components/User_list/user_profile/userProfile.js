import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import './userprofile.css'
import no_profile from '../../../pictures/no_profile.jpg'
import { Button } from "@chakra-ui/react";
import { Navbar } from "../../nabvar/nabvar";


function UserProfile() {
  const { uid } = useParams(); // Obtén el parámetro de la URL
  const [user, setUser] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.error("Usuario no encontrado");
      }
    };

    fetchUser();
  }, [uid, db]);

  if (!user){
    return  (<div className="spinner">
        <span></span>
        <span></span>
        <span></span>
    </div>
    )  
}
console.log(user.photoURL)
  return (
    <div className="user-profile">
      <Navbar/>
      <img src={user.photoURL ? user.photoURL : no_profile } alt="Foto de perfil"  className="user-photo-profile"/>
      <h1>{user && user.displayName ? user.displayName : "Usuario"}</h1>
      <p>Aqui van mis gustos  y lo que ando buscando
         para que los otros usuarios sepan lo que busco</p>
      <Button colorScheme="blue" className="btn-send-message">Enviar mensaje</Button>
    </div>
  );
}

export default UserProfile;
