import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(email, password, fullName);
        } catch {
            // error is set in context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <div style={{ marginBottom: '15px' }}>
                    <label>Full Name:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <button type="submit" disabled={isSubmitting}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;