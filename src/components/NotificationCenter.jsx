// src/components/NotificationCenter.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationRead, markAllRead } from '../utils/addNotification';

const NotificationCenter = () => {
  const notifications = useSelector(state => state.notifications);
  const dispatch = useDispatch();

  const handleMarkRead = (id) => {
    try {
      dispatch(markNotificationRead({ id }));
    } catch (err) {
      alert("Failed to mark notification as read");
    }
  };

  const handleMarkAll = () => {
    try {
      dispatch(markAllRead());
    } catch (err) {
      alert("Failed to mark all notifications as read");
    }
  };

  if (!notifications.length) {
    return <div className="p-6 text-center text-gray-500">No notifications yet</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#0099CC]">Notifications</h2>
        <button
          onClick={handleMarkAll}
          className="px-3 py-1 bg-[#0099CC] text-white rounded-lg hover:bg-[#007ea8]"
        >
          Mark All as Read
        </button>
      </div>

      <ul className="space-y-3">
        {notifications.map(n => (
          <li
            key={n.id}
            onClick={() => handleMarkRead(n.id)}
            className={`p-4 rounded-lg border cursor-pointer transition ${n.read ? 'bg-gray-50 border-gray-200' : 'bg-[#e0f7fa] border-[#0099CC]'
              }`}
          >
            <p className="font-medium">{n.message || `${n.firstName} ${n.lastName}`}</p>
            <p className="text-sm text-gray-500">
              {new Date(n.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCenter;
