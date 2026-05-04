import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.full_name || user?.email}!</p>
            <p>Account created: {new Date(user?.created_at).toLocaleDateString()}</p>
            <button onClick={logout}
                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;