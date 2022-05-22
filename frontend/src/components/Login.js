import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const requestLogin = () => {
        
    }

    return (
        <div className="form-page">
            <h1>Login Page</h1>
            <div>
                <label for="username">Username:</label>
                <input type='text' name='username' data-cy='username' onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type='text' name='password' data-cy='password' onChange={e => setPassword(e.target.value)} />
            </div>
            <input type='submit' value='Submit' data-cy='submit' onClick={requestLogin} />
        </div>
    );
}