import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    
    const requestSignup = () => {
        
    }

    return (
        <div className="form-page">
            <h1>Signup Page</h1>
            <div>
                <label for="username">Username:</label>
                <input type='text' name='username' data-cy='username' onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type='text' name='password' data-cy='password' onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
                <label for="Full Name">Full Name:</label>
                <input type='text' name='fullname' data-cy='fullname' onChange={e => setName(e.target.value)} />
            </div>
            <input type='submit' value='Submit' data-cy='submit' onClick={requestSignup} />
        </div>
    );
}