import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const MenuLinks = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return (
        <>
          <Link to="/">Dashboard</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/users">Users</Link>
          <Link to="/profile">Profile</Link>
          
        </>
      );
    case 'doctor':
      return (
        <>
          <Link to="/">Dashboard</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/profile">Profile</Link>
        </>
      );
      case 'nurse':
      return (
        <>
          <Link to="/">Dashboard</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/profile">Profile</Link>
        </>
      );
    case 'patient':
      return (
        <>
          <Link to="/">Dashboard</Link>
         
          <Link to="/profile">Profile</Link>
        </>
      );
    default:
      return (
        <>
        <Link to="/">Dashboard</Link>;
        <Link to="/profile">Profile</Link>
        </>
      );  
  }
};

export default MenuLinks;
