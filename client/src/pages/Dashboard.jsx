import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Focus & Habit Tracker</h1>
        <p style={styles.subtitle}>You are successfully logged in!</p>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#010807',
    fontFamily: "'Orbitron', sans-serif",
  },
  card: {
    padding: '50px 40px',
    background: 'rgba(0, 15, 12, 0.82)',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(0, 255, 204, 0.3)',
    borderRadius: '30px',
    textAlign: 'center',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.9)',
    maxWidth: '500px',
    width: '90%',
  },
  title: {
    color: '#00ffcc',
    fontSize: '1.5rem',
    letterSpacing: '2px',
    marginBottom: '20px',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: 'white',
    fontSize: '0.9rem',
    marginBottom: '30px',
    opacity: 0.8,
  },
  logoutBtn: {
    padding: '12px 30px',
    background: 'transparent',
    border: '2px solid #00ffcc',
    color: '#00ffcc',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 'bold',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    transition: '0.4s',
  },
};

export default Dashboard;
