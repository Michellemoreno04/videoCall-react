import React from 'react'
import '../nabvar/nabvar.css'
import { logout } from '../../firebase/auth'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Button,
  Icon
} from '@chakra-ui/react'
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import no_profile from '../../pictures/no_profile.jpg'

export const Navbar = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Obtén el usuario autenticado
  

  return (
    <nav className='navbar'>
     

      <Link to='/usersList' className='btn-nav'>
        <Button colorScheme='blue'>Usuarios</Button>
      </Link>
      <Link to='/videoChat' className='btn-nav'>
        <Button colorScheme='blue'>Video Chat</Button>
      </Link>

      <Cuenta user={user} />
      
    </nav>
  )
}

export const Cuenta = ({ user }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    if (user) {
      // Redirige al usuario a su perfil usando su UID
      navigate(`/profile/${user.uid}`);
    } else {
      // Si no hay usuario autenticado, redirige a la página de inicio de sesión o muestra un mensaje
      navigate('/login');
    }
  };

  return (
    <div className='menu'>
      <Menu>
        <MenuButton as={Button} colorScheme='transparent'>
          {
            <div className='foto-logo-container'>
            <img src={user && user.photoURL ? user.photoURL : no_profile} alt="logo" className='img-logo'/>
            <span>{user && user.displayName ? user.displayName : "Usuario"} 
              
            </span>
          </div>
          }
        </MenuButton>
        <MenuList>
          <MenuGroup>
            <MenuItem onClick={goToProfile}>My Account</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
