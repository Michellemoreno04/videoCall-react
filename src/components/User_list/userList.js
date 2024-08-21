import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import './userList.css';
import no_profile from '../../pictures/no_profile.jpg'
import { Link } from 'react-router-dom'
import { Navbar } from '../nabvar/nabvar'

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })); // Incluye el ID del documento como parte de los datos del usuario
      setUsers(usersList);
      setFilteredUsers(usersList); // Inicializa la lista filtrada
    };

    fetchUsers();
  }, [db]);

  return (
    <div className="user-list">
      <Navbar />
      <div className="search-bar">
        <h1>All Members</h1>
        <SearchBar users={users} onSearch={setFilteredUsers} />
      </div>
      <div className="user-card-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <li key={user.uid}> {/* Asegúrate de que la clave sea única */}
              <Link to={`/profile/${user.uid}`}>
                <div className="user-card">
                  <img src={user.photoURL || no_profile} alt="Foto de perfil" className="user-photo" />
                  <div className="user-info">
                    <p className="user-name">{user.displayName || user.email}</p>
                    <span>Estos van a ser mis gustos</span>
                  </div>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="no-users-found">No se encontraron usuarios que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
}



const SearchBar = ({ users, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    const filteredUsers = users.filter(user =>
      (user.displayName || user.email).toLowerCase().includes(term.toLowerCase())
    );
    onSearch(filteredUsers);
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };
  if (!users) {
    return (<div className="spinner">
      <span></span>
      <span></span>
      <span></span>
</div>
)
    
  }

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={handleInputChange} // Cambia aquí para buscar en tiempo real
        className="search-input"
      />
      <button onClick={() => handleSearch(searchTerm)} className="search-button">
        Search
      </button>
    </div>
  );
};


export default UserList;
