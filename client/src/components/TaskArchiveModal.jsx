import { useState, useEffect } from 'react';
import { getAllTasks } from '../services/api';

const TaskArchiveModal = ({ onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'deleted', 'completed'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isDeleted;
    if (filter === 'deleted') return task.isDeleted;
    if (filter === 'completed') return task.completionStats?.totalCompleted > 0;
    return true; // 'all'
  });

  const getDaysOfWeekString = (daysArray) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysArray.map(d => dayNames[d]).join(', ');
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .archive-modal {
          background: linear-gradient(135deg, rgba(2, 15, 13, 0.98), rgba(0, 40, 35, 0.95));
          border: 2px solid #00ffcc;
          border-radius: 16px;
          padding: 30px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 0 50px rgba(0, 255, 204, 0.3);
          font-family: 'Orbitron', sans-serif;
        }

        .archive-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0, 255, 204, 0.3);
        }

        .archive-title {
          font-size: 1.6rem;
          color: #00ffcc;
          text-shadow: 0 0 10px rgba(0, 255, 204, 0.6);
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: 1px solid #00ffcc;
          color: #00ffcc;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #00ffcc;
          color: #020f0d;
          box-shadow: 0 0 15px rgba(0, 255, 204, 0.6);
        }

        .filter-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .filter-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #00ffcc;
          color: #00ffcc;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s;
          font-family: 'Orbitron', sans-serif;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: #00ffcc;
          color: #020f0d;
        }

        .tasks-grid {
          display: grid;
          gap: 15px;
        }

        .archive-task-card {
          background: rgba(0, 255, 204, 0.05);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 10px;
          padding: 20px;
          transition: all 0.3s;
        }

        .archive-task-card:hover {
          background: rgba(0, 255, 204, 0.1);
          border-color: #00ffcc;
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
        }

        .archive-task-card.deleted {
          opacity: 0.6;
          border-color: rgba(255, 100, 100, 0.5);
        }

        .task-info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .task-name {
          font-size: 1.1rem;
          color: #00ffcc;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .task-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 5px;
        }

        .badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.7rem;
          border: 1px solid;
        }

        .badge.dial {
          border-color: #ffcc00;
          color: #ffcc00;
          background: rgba(255, 204, 0, 0.1);
        }

        .badge.deleted {
          border-color: #ff6666;
          color: #ff6666;
          background: rgba(255, 102, 102, 0.1);
        }

        .task-meta {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 10px;
          display: grid;
          gap: 5px;
        }

        .task-stats {
          display: flex;
          gap: 15px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 255, 204, 0.2);
        }

        .stat-box {
          flex: 1;
          text-align: center;
          padding: 8px;
          background: rgba(0, 255, 204, 0.05);
          border-radius: 6px;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          margin-bottom: 3px;
        }

        .stat-number {
          font-size: 1.2rem;
          color: #00ffcc;
          font-weight: bold;
        }

        .loading-text {
          text-align: center;
          color: #00ffcc;
          padding: 40px;
          font-size: 1.1rem;
        }

        .no-tasks-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          padding: 40px;
          font-size: 0.9rem;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="archive-modal" onClick={(e) => e.stopPropagation()}>
          <div className="archive-header">
            <h2 className="archive-title">⚡ Neural Archive</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="filter-bar">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`filter-btn ${filter === 'deleted' ? 'active' : ''}`}
              onClick={() => setFilter('deleted')}
            >
              Deleted
            </button>
          </div>

          <div className="tasks-grid">
            {loading ? (
              <div className="loading-text">Loading neural pathways...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="no-tasks-text">No tasks found</div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task._id} 
                  className={`archive-task-card ${task.isDeleted ? 'deleted' : ''}`}
                >
                  <div className="task-info-row">
                    <div>
                      <div className="task-name">{task.title}</div>
                      <div className="task-badges">
                        {task.isDialTask && <span className="badge dial">⚡ Dial Task</span>}
                        {task.isDeleted && <span className="badge deleted">Deleted</span>}
                      </div>
                    </div>
                  </div>

                  <div className="task-meta">
                    <div>📅 Days: {getDaysOfWeekString(task.daysOfWeek)}</div>
                    <div>📆 Period: {task.startDate} → {task.endDate}</div>
                    {task.startTime && <div>⏰ Time: {task.startTime} {task.endTime && `- ${task.endTime}`}</div>}
                    {task.isDeleted && task.deletedAt && (
                      <div>🗑️ Deleted: {new Date(task.deletedAt).toLocaleDateString()}</div>
                    )}
                  </div>

                  {task.completionStats && (
                    <div className="task-stats">
                      <div className="stat-box">
                        <span className="stat-label">Completed</span>
                        <div className="stat-number">{task.completionStats.totalCompleted || 0}</div>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Missed</span>
                        <div className="stat-number">{task.completionStats.totalMissed || 0}</div>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Rate</span>
                        <div className="stat-number">
                          {task.completionStats.completionRate || 0}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskArchiveModal;
