import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createSocketConnection } from '../utils/socket';
import { addNotification } from '../utils/addNotification.js';

export let globalSocket = null;

const NotificationListener = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!user?._id || isInitialized.current) return;

    const socket = createSocketConnection();
    globalSocket = socket; 
    isInitialized.current = true;

    socket.emit('setOnline', user._id);

    socket.on('newMessageNotification', (data) => {
      toast.info(`💬 ${data.firstName}: ${data.text}`);
      dispatch(addNotification({ ...data, type: 'message', read: false }));
    });

    socket.on('newConnectionRequest', (data) => {
      toast.info(`🤝 ${data.firstName} sent you a connection request`);
      dispatch(addNotification({ ...data, type: 'connectionRequest', read: false }));
    });

    socket.on('connectionAccepted', (data) => {
      toast.success(`✅ ${data.message}`);
      dispatch(addNotification({ ...data, type: 'requestAccepted', read: false }));
    });

    socket.on('connectionAdded', (data) => {
      toast.success(`🎉 ${data.message}`);
      dispatch(addNotification({ ...data, type: 'connectionAdded', read: false }));
    });

    return () => {
      socket.off('newMessageNotification');
      socket.off('newConnectionRequest');
      socket.off('connectionAccepted');
      socket.off('connectionAdded');
      socket.disconnect();
      globalSocket = null;
      isInitialized.current = false;
    };
  }, [user, dispatch]);

  return null;
};

export default NotificationListener;
