import { useState } from 'react';
import { createTask } from '../services/api';

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    daysOfWeek: [],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });

  const daysOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayToggle = (day) => {
    if (formData.daysOfWeek.includes(day)) {
      setFormData({
        ...formData,
        daysOfWeek: formData.daysOfWeek.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        daysOfWeek: [...formData.daysOfWeek, day],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.daysOfWeek.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }

    try {
      await createTask(formData);
      onTaskCreated();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    }
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
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: rgba(0, 15, 12, 0.95);
          backdrop-filter: blur(25px);
          border: 2px solid rgba(0, 255, 204, 0.3);
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          font-family: 'Orbitron', sans-serif;
        }

        .modal-header {
          color: #00ffcc;
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: #00ffcc;
          font-size: 0.8rem;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 8px;
          color: white;
          font-family: 'Orbitron', sans-serif;
          outline: none;
          transition: 0.3s;
        }

        .form-input:focus {
          border-color: #00ffcc;
          background: rgba(0, 255, 204, 0.08);
        }

        .form-textarea {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 8px;
          color: white;
          font-family: 'Orbitron', sans-serif;
          outline: none;
          transition: 0.3s;
          resize: vertical;
          min-height: 80px;
        }

        .form-textarea:focus {
          border-color: #00ffcc;
          background: rgba(0, 255, 204, 0.08);
        }

        .days-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .day-checkbox {
          flex: 1;
          min-width: 60px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 8px;
          color: white;
          text-align: center;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.8rem;
        }

        .day-checkbox:hover {
          background: rgba(0, 255, 204, 0.1);
        }

        .day-checkbox.selected {
          background: #00ffcc;
          color: #010807;
          border-color: #00ffcc;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.3s;
          border: none;
        }

        .modal-btn-primary {
          background: #00ffcc;
          color: #010807;
        }

        .modal-btn-primary:hover {
          box-shadow: 0 0 20px #00ffcc;
        }

        .modal-btn-secondary {
          background: transparent;
          border: 2px solid #00ffcc;
          color: #00ffcc;
        }

        .modal-btn-secondary:hover {
          background: rgba(0, 255, 204, 0.1);
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-header">Create New Task</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter task title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Days of Week *</label>
              <div className="days-container">
                {daysOfWeekLabels.map((day, index) => (
                  <div
                    key={index}
                    className={`day-checkbox ${formData.daysOfWeek.includes(index) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(index)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="modal-btn modal-btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;
