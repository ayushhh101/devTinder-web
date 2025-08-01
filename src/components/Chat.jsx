import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

// Debounce typing events
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const Chat = () => {
  const { targetUserId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const user = useSelector(store => store.user)
  const userId = user?._id;
  //for typing
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTyping = useRef(false);

  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  const [onlineStatus, setOnlineStatus] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const getSecretRoomId = async (userId, targetUserId) => {
    const encoder = new TextEncoder();
    const data = encoder.encode([userId, targetUserId].sort().join("_"));

    // Hash the encoded data using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
  };


  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`,
        { withCredentials: true }
      )

      console.log(chat.data.messages)

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text: text
        }
      })

      setMessages(chatMessages)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchChatMessages()
  }, [])

  //connecting to the server as soon as the page loads
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection()
    socketRef.current = socket
    //As soon as the page loads , the socket connection is made and joinChat event is emitted
    const roomId = getSecretRoomId(userId, targetUserId);
    socket.emit('joinChat', { firstName: user.firstName, userId, targetUserId })

    socket.on('messageReceived', ({ firstName, lastName, text }) => {
      console.log(firstName + " " + text)
      setMessages((messages) => [...messages, { firstName, lastName, text }])
    })

    //for typing 
    socket.on('typing', ({ firstName }) => {
      console.log('Received typing event from', firstName);
      setTypingUser(firstName);
      setIsTargetTyping(true);
      // Auto-reset typing after 3 seconds
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTargetTyping(false);
      }, 3000);
    });

    socket.on('stopTyping', () => {
      setIsTargetTyping(false);
      clearTimeout(typingTimeoutRef.current);
    });

    // Status tracking
    socket.on('userStatusResponse', ({ status, lastSeen }) => {
      setOnlineStatus(status === 'online');
      if (lastSeen) setLastSeen(new Date(lastSeen));
    });

    socket.on('userStatusChanged', ({ userId: changedUserId, status, lastSeen }) => {
      if (changedUserId === targetUserId) {
        setOnlineStatus(status === 'online');
        if (lastSeen) setLastSeen(new Date(lastSeen));
      }
    });

    // Set initial status
    socket.emit('setOnline', userId);
    socket.emit('getUserStatus', targetUserId);

    return () => {
      socket.disconnect()
      clearTimeout(typingTimeoutRef.current);
    }
  }, [userId, targetUserId])

  // Add this useEffect for status tracking
  useEffect(() => {
    if (!socketRef.current || !userId) return;

    // Set current user as online
    socketRef.current.emit('setOnline', userId);

    // Listen for status changes
    socketRef.current.on('userStatusChanged', ({ userId: changedUserId, status, lastSeen }) => {
      if (changedUserId === targetUserId) {
        setOnlineStatus(status === 'online');
        if (lastSeen) setLastSeen(new Date(lastSeen));
      }
    });

    // Request initial status
    socketRef.current.emit('getUserStatus', targetUserId);

    return () => {
      socketRef.current.off('userStatusChanged');
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    console.log('Emitting sendMessage event');
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        firstName: user.firstName,
        lastName: user.lastName,
        userId,
        targetUserId,
        text: newMessage
      })
    }
    setNewMessage('');
    // Also stop typing after sending
    if (socketRef.current) {
      socketRef.current.emit('stopTyping', { userId, targetUserId });
    }
  }

  //for typing
  const handleTyping = (e) => {
    const text = e.target.value;
    setNewMessage(text);

    if (!socketRef.current) return;

    // Emit typing status
    if (text.trim() && !isTyping.current) {
      isTyping.current = true;
      socketRef.current.emit('typing', {
        userId,
        targetUserId,
        firstName: user.firstName
      });
    } else if (!text.trim() && isTyping.current) {
      isTyping.current = false;
      socketRef.current.emit('stopTyping', { userId, targetUserId });
    }

    // Reset typing status after delay
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping.current) {
        isTyping.current = false;
        socketRef.current.emit('stopTyping', { userId, targetUserId });
      }
    }, 2000);
  };

  // Format last seen time
  const formatLastSeen = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4'
      style={{
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
      }}
    >
      <div className='w-full max-w-4xl h-[80vh] flex flex-col bg-[#0f172a] bg-opacity-90 backdrop-blur-sm border-2 border-[#8b5cf6] rounded-2xl shadow-2xl overflow-hidden'>

        {/* Chat Header */}
        <div className='p-6 border-b border-[#8b5cf6] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-white flex items-center gap-3'>
              <div className={`w-3 h-3 rounded-full ${onlineStatus ?
                'bg-green-400 animate-pulse' :
                'bg-gray-400'
                }`}></div>
              Chat with {typingUser || 'User'}
            </h1>
            {!onlineStatus && lastSeen && (
              <span className='text-xs text-white opacity-80'>
                Last seen {formatLastSeen(lastSeen)}
              </span>
            )}
          </div>
          {isTargetTyping && (
            <div className='text-xs text-white opacity-80 mt-1'>
              {typingUser} is typing...
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className='flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-[#8b5cf6] scrollbar-track-transparent'>
          {messages.map((msg, index) => {
            const isCurrentUser = user.firstName === msg.firstName;
            return (
              <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${isCurrentUser
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-br-sm'
                  : 'bg-[#1e293b] text-white rounded-bl-sm border border-gray-600'
                  }`}>
                  <div className={`text-xs font-semibold mb-1 ${isCurrentUser ? 'text-orange-200' : 'text-[#f97316]'
                    }`}>
                    {msg.firstName + " " + msg.lastName}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.text}</div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTargetTyping && (
            <div className='flex justify-start'>
              <div className='bg-[#1e293b] border border-gray-600 px-4 py-3 rounded-2xl rounded-bl-sm'>
                <div className='text-[#f97316] text-xs font-semibold mb-1'>
                  {typingUser}
                </div>
                <div className='flex items-center gap-1 text-gray-400'>
                  <span className='text-sm'>typing</span>
                  <div className='flex gap-1'>
                    <div className='w-1 h-1 bg-[#8b5cf6] rounded-full animate-bounce'></div>
                    <div className='w-1 h-1 bg-[#8b5cf6] rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                    <div className='w-1 h-1 bg-[#8b5cf6] rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className='p-6 border-t border-[#8b5cf6] bg-[#0f172a] bg-opacity-80'>
          <div className='flex items-center gap-4'>
            <input
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className='flex-1 bg-[#1e293b] border border-gray-600 text-white rounded-full px-6 py-3 focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-opacity-50 placeholder-gray-400 transition-all duration-300'
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className='px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]'
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat