import logo from './logo.svg';
import './App.css';
import { useCallback, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./context/UserContext";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthWrapper from './components/AuthWrapper';
import Profile from './components/Profile';

function App() {
  const [userContext, setUserContext] = useContext(UserContext);

  

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthWrapper />}>
            <Route path='/' element={<Home />} />
            <Route path='/:username' element={<Profile />} />
            </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
