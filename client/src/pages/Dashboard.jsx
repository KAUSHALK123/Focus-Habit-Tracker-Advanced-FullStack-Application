import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayTasks, toggleComplete, toggleDial, deleteTask } from '../services/api';
import CreateTaskModal from '../components/CreateTaskModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [todayTasks, setTodayTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTodayTasks();
    }

    // Update time every second for smooth clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const fetchTodayTasks = async () => {
    try {
      console.log('Dashboard: Fetching today tasks...');
      const data = await getTodayTasks();
      console.log('Dashboard: Received', data.length, 'tasks');
      setTodayTasks(data);
    } catch (error) {
      console.error('Dashboard: Error fetching tasks:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'missed' : 'completed';
      await toggleComplete(taskId, newStatus);
      await fetchTodayTasks(); // Refetch immediately
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  const handleToggleDial = async (taskId) => {
    try {
      await toggleDial(taskId);
      await fetchTodayTasks(); // Refetch immediately
    } catch (error) {
      alert(error.response?.data?.message || 'Error toggling dial');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        await fetchTodayTasks(); // Refetch immediately
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting task');
      }
    }
  };

  const handleTaskCreated = async () => {
    await fetchTodayTasks(); // Refetch immediately after creation
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const dialTasksCount = todayTasks.filter(task => task.isDialTask).length;
  const completedCount = todayTasks.filter(task => task.completionStatus === 'completed').length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #020f0d;
          font-family: 'Orbitron', sans-serif;
          color: white;
          overflow-x: hidden;
        }

        .dashboard-wrapper {
          min-height: 100vh;
          background: #020f0d;
          padding: 20px;
          position: relative;
        }

        .logout-btn {
          position: absolute;
          top: 20px;
          right: 30px;
          padding: 10px 20px;
          background: transparent;
          border: 1px solid #00ffcc;
          color: #00ffcc;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          font-weight: bold;
          letter-spacing: 1px;
          transition: all 0.3s;
          text-transform: uppercase;
          z-index: 100;
        }

        .logout-btn:hover {
          background: #00ffcc;
          color: #020f0d;
          box-shadow: 0 0 15px #00ffcc;
        }

        .clock-section {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 40px 0 30px 0;
        }

        .digital-clock {
          font-size: 5rem;
          color: #00ffcc;
          letter-spacing: 15px;
          text-shadow: 0 0 30px rgba(0, 255, 204, 0.8),
                       0 0 60px rgba(0, 255, 204, 0.5);
          font-weight: 700;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 20px;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .panel {
          background: rgba(0, 15, 12, 0.6);
          border: 1px solid #00ffcc;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.1);
        }

        .panel-title {
          color: #00ffcc;
          font-size: 0.85rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 25px;
          font-weight: bold;
        }

        /* LEFT PANEL - Mind Mapping */
        .mind-mapping-circle {
          width: 280px;
          height: 280px;
          margin: 30px auto;
          border: 3px solid #00ffcc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(0, 255, 204, 0.3),
                      inset 0 0 30px rgba(0, 255, 204, 0.1);
          position: relative;
        }

        .circle-center {
          font-size: 0.9rem;
          color: #00ffcc;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          line-height: 1.6;
        }

        .create-task-btn {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 2px solid #00ffcc;
          color: #00ffcc;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 0.85rem;
          transition: all 0.4s;
          margin-top: 20px;
        }

        .create-task-btn:hover {
          background: #00ffcc;
          color: #020f0d;
          box-shadow: 0 0 30px rgba(0, 255, 204, 0.6);
        }

        /* CENTER PANEL */
        .neural-focus-btn {
          width: 100%;
          padding: 20px;
          background: #00ffcc;
          border: none;
          color: #020f0d;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-size: 0.9rem;
          box-shadow: 0 0 25px rgba(0, 255, 204, 0.5);
          transition: all 0.3s;
          margin-bottom: 25px;
        }

        .neural-focus-btn:hover {
          box-shadow: 0 0 40px rgba(0, 255, 204, 0.8);
          transform: translateY(-2px);
        }

        .date-display {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          margin-bottom: 30px;
          padding: 15px;
          background: rgba(0, 255, 204, 0.05);
          border-radius: 10px;
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 15px;
          background: rgba(0, 255, 204, 0.08);
          border: 1px solid rgba(0, 255, 204, 0.2);
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-value {
          color: #00ffcc;
          font-weight: bold;
        }

        /* RIGHT PANEL - Tasks */
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .tasks-list::-webkit-scrollbar {
          width: 6px;
        }

        .tasks-list::-webkit-scrollbar-track {
          background: rgba(0, 255, 204, 0.05);
          border-radius: 10px;
        }

        .tasks-list::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 204, 0.3);
          border-radius: 10px;
        }

        .task-card {
          background: rgba(0, 255, 204, 0.05);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 10px;
          padding: 15px;
          transition: all 0.3s;
        }

        .task-card:hover {
          background: rgba(0, 255, 204, 0.1);
          border-color: #00ffcc;
        }

        .task-card.completed {
          opacity: 0.6;
          background: rgba(0, 255, 204, 0.15);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .task-title {
          color: #00ffcc;
          font-size: 0.85rem;
          font-weight: bold;
          flex: 1;
        }

        .task-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.7rem;
          margin-bottom: 10px;
        }

        .task-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .task-btn {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #00ffcc;
          color: #00ffcc;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.3s;
          font-family: 'Orbitron', sans-serif;
        }

        .task-btn:hover {
          background: #00ffcc;
          color: #020f0d;
        }

        .task-btn.active {
          background: #00ffcc;
          color: #020f0d;
        }

        .no-tasks {
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.8rem;
          padding: 40px 20px;
        }

        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .digital-clock {
            font-size: 3rem;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>

        {/* Digital Clock */}
        <div className="clock-section">
          <div className="digital-clock">
            {currentTime.getHours().toString().padStart(2, '0')}:
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </div>
        </div>

        {/* Main 3-Panel Grid */}
        <div className="main-grid">
          {/* LEFT PANEL - Mind Mapping */}
          <div className="panel">
            <div className="panel-title">Mind Mapping</div>
            <div className="mind-mapping-circle">
              <div className="circle-center">
                Neural<br/>Focus<br/>Dial
              </div>
            </div>
            <button className="create-task-btn" onClick={() => setShowModal(true)}>
              + Create Task
            </button>
          </div>

          {/* CENTER PANEL - Focus Mode & Stats */}
          <div className="panel">
            <button className="neural-focus-btn">
              Neural Focus Mode
            </button>
            
            <div className="date-display">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-label">Today's Tasks:</span>
                <span className="stat-value">{todayTasks.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{completedCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Dial Tasks:</span>
                <span className="stat-value">{dialTasksCount} / 8</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Today's Tasks */}
          <div className="panel">
            <div className="panel-title">Today's Neural Pathways</div>
            <div className="tasks-list">
              {todayTasks.length === 0 ? (
                <div className="no-tasks">No tasks for today</div>
              ) : (
                todayTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className={`task-card ${task.completionStatus === 'completed' ? 'completed' : ''}`}
                  >
                    <div className="task-header">
                      <div className="task-title">
                        {task.isDialTask && '⚡ '}
                        {task.title}
                      </div>
                    </div>
                    
                    {(task.startTime || task.endTime) && (
                      <div className="task-time">
                        {task.startTime && task.endTime 
                          ? `${task.startTime} - ${task.endTime}`
                          : task.startTime || task.endTime
                        }
                      </div>
                    )}

                    <div className="task-actions">
                      <button
                        className={`task-btn ${task.completionStatus === 'completed' ? 'active' : ''}`}
                        onClick={() => handleToggleComplete(task._id, task.completionStatus)}
                        title="Toggle complete"
                      >
                        <i className={`fa-solid ${task.completionStatus === 'completed' ? 'fa-check' : 'fa-circle'}`}></i>
                      </button>
                      <button
                        className={`task-btn ${task.isDialTask ? 'active' : ''}`}
                        onClick={() => handleToggleDial(task._id)}
                        title="Toggle dial"
                      >
                        <i className="fa-solid fa-bolt"></i>
                      </button>
                      <button
                        className="task-btn"
                        onClick={() => handleDeleteTask(task._id)}
                        title="Delete"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </>
  );
};

export default Dashboard;
