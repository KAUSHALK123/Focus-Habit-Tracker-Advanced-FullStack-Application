import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Global string Y-coordinates
    let s1Y, s2Y, s3Y;

    const updateWaves = () => {
      const w = window.innerWidth + 200;
      const h = window.innerHeight;
      
      s1Y = h * 0.3;
      s2Y = h * 0.5;
      s3Y = h * 0.7;

      // Setting wavy paths (M = Start, Q = Control Point + End Point)
      const string1 = document.getElementById('string1');
      const string2 = document.getElementById('string2');
      const string3 = document.getElementById('string3');

      if (string1 && string2 && string3) {
        string1.setAttribute('d', `M -100 ${s1Y} Q ${w/4} ${s1Y-100} ${w/2} ${s1Y} T ${w+100} ${s1Y}`);
        string2.setAttribute('d', `M -100 ${s2Y} Q ${w/4} ${s2Y+100} ${w/2} ${s2Y} T ${w+100} ${s2Y}`);
        string3.setAttribute('d', `M -100 ${s3Y} Q ${w/4} ${s3Y-80} ${w/2} ${s3Y} T ${w+100} ${s3Y}`);
      }
    };

    const pluckNearestString = (e) => {
      const clickY = e.clientY;
      
      // Calculate distances to the current positions of the waves
      const distances = [
        { id: 'string1', dist: Math.abs(clickY - s1Y) },
        { id: 'string2', dist: Math.abs(clickY - s2Y) },
        { id: 'string3', dist: Math.abs(clickY - s3Y) }
      ];

      // Pick the closest wave
      distances.sort((a, b) => a.dist - b.dist);
      const string = document.getElementById(distances[0].id);

      if (string) {
        // Trigger Pluck Animation
        string.classList.remove('plucked');
        void string.offsetWidth; // Trigger reflow
        string.classList.add('plucked');

        setTimeout(() => {
          string.classList.remove('plucked');
        }, 700);
      }
    };

    window.addEventListener('resize', updateWaves);
    document.body.addEventListener('mousedown', pluckNearestString);
    
    updateWaves();

    return () => {
      window.removeEventListener('resize', updateWaves);
      document.body.removeEventListener('mousedown', pluckNearestString);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        :root {
          --neon-green: #00ffcc;
          --dark-bg: #010807;
          --wave-white: rgba(255, 255, 255, 0.8);
          --glass-border: rgba(0, 255, 204, 0.3);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: var(--dark-bg);
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          overflow: hidden;
          color: white;
          cursor: crosshair;
        }

        #root {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-floor {
          position: absolute;
          bottom: -10%;
          width: 200%;
          height: 50%;
          background-image: 
            linear-gradient(var(--neon-green) 1px, transparent 1px),
            linear-gradient(90deg, var(--neon-green) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(500px) rotateX(65deg) translate(-25%, 0);
          opacity: 0.1;
          z-index: 1;
          pointer-events: none;
        }

        .wave-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .wave-svg {
          width: 100%;
          height: 100%;
        }

        .brain-string {
          fill: none;
          stroke: var(--wave-white);
          stroke-width: 2;
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
          transition: stroke 0.4s ease;
          transform-origin: center;
        }

        .wire-1 { animation: ambientWave 8s infinite ease-in-out; opacity: 0.8; }
        .wire-2 { animation: ambientWave 10s infinite ease-in-out reverse; opacity: 0.5; }
        .wire-3 { animation: ambientWave 12s infinite ease-in-out; opacity: 0.3; }

        @keyframes ambientWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.15) translateY(-10px); }
        }

        .plucked {
          animation: guitarPluck 0.7s ease-out !important;
          stroke: var(--neon-green) !important;
          stroke-width: 4;
        }

        @keyframes guitarPluck {
          0% { transform: translateY(0); }
          15% { transform: translateY(-25px); }
          30% { transform: translateY(20px); }
          45% { transform: translateY(-15px); }
          60% { transform: translateY(10px); }
          75% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 90%;
          max-width: 380px;
          padding: 50px 40px;
          background: rgba(0, 15, 12, 0.82);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid var(--glass-border);
          border-radius: 30px;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9);
          cursor: default;
        }

        .hexagon-logo {
          width: 65px;
          height: 65px;
          background: var(--neon-green);
          margin: 0 auto 25px;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--dark-bg);
          font-size: 26px;
          box-shadow: 0 0 20px var(--neon-green);
        }

        h1 {
          color: var(--neon-green);
          font-size: 1.1rem;
          letter-spacing: 2px;
          margin-bottom: 35px;
          text-transform: uppercase;
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
          text-align: left;
        }

        .input-group i {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neon-green);
          opacity: 0.7;
        }

        .input-group input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: white;
          font-family: 'Orbitron', sans-serif;
          outline: none;
          transition: 0.3s;
          cursor: text;
        }

        .input-group input:focus {
          border-color: var(--neon-green);
          background: rgba(0, 255, 204, 0.08);
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 2px solid var(--neon-green);
          color: var(--neon-green);
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: 0.4s;
          margin-top: 10px;
        }

        .login-btn:hover {
          background: var(--neon-green);
          color: var(--dark-bg);
          box-shadow: 0 0 30px var(--neon-green);
        }

        .register-link {
          margin-top: 20px;
          font-size: 0.75rem;
          color: var(--neon-green);
          opacity: 0.7;
          cursor: pointer;
          transition: 0.3s;
          text-align: center;
        }

        .register-link:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .motto {
          margin-top: 40px;
          font-size: 0.7rem;
          letter-spacing: 5px;
          opacity: 0.3;
          text-transform: uppercase;
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

      <div className="grid-floor"></div>

      <div className="wave-wrapper">
        <svg className="wave-svg" id="svgContainer">
          <path id="string1" className="brain-string wire-1" d="" />
          <path id="string2" className="brain-string wire-2" d="" />
          <path id="string3" className="brain-string wire-3" d="" />
        </svg>
      </div>

      <main className="login-card">
        <div className="hexagon-logo">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <h1>Ascend: Focus & Strength</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fa-solid fa-user"></i>
            <input 
              type="text" 
              placeholder="IDENTITY" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <i className="fa-solid fa-lock"></i>
            <input 
              type="password" 
              placeholder="ACCESS KEY" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">Sync Link</button>
        </form>

        <div className="register-link" onClick={() => navigate('/register')}>
          New here? Create Account
        </div>

        <div className="motto">Focus • Fitness • Future</div>
      </main>
    </>
  );
};

export default Login;
