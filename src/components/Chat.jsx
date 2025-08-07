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

  const [targetUser, setTargetUser] = useState(null);

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

  const [inCall, setInCall] = useState(false)
  const [callStartedByMe, setCallStartedByMe] = useState(false)
  const [callRinging, setCallRinging] = useState(false)
  const [remoteUserName, setRemoteUserName] = useState('')
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  // STUN public Google
  const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/user/${targetUserId}`, { withCredentials: true });
        setTargetUser(data); // adjust 'data.data' if your API returns user object differently
      } catch (error) {
        setTargetUser(null);
      }
    };
    fetchTargetUser();
  }, [targetUserId]);

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

  const appBlue = "#16a3bb";
  const appPink = "#fc787a";
  const appBg = "#f6fbff";

  // Scroll to bottom on new message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTargetTyping]);

  useEffect(() => {
    if (!socketRef.current) return
    // Listen for signaling events
    
    socketRef.current.on("video-offer", async ({ offer, from }) => {
      setRemoteUserName(from.firstName)
      if (!peerConnectionRef.current) createPeerConnection()
      await peerConnectionRef.current.setRemoteDescription(offer)
      // Get local stream and add tracks
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = localStream
      localVideoRef.current.srcObject = localStream
      localStream.getTracks().forEach(track =>
        peerConnectionRef.current.addTrack(track, localStream)
      )
      // Create and send answer
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      socketRef.current.emit('video-answer', {
        targetUserId,
        answer: peerConnectionRef.current.localDescription,
        from: { firstName: user.firstName, userId }
      })
      setInCall(true)
      setCallRinging(false)
    })

    socketRef.current.on("video-answer", async ({ answer }) => {
      // Receiving answer — caller
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer)
        setInCall(true)
        setCallRinging(false)
      }
    })

    socketRef.current.on("ice-candidate", ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        peerConnectionRef.current.addIceCandidate(candidate)
      }
    })

    // Optional: handle call hang-up events

    return () => {
      // Remove listeners if needed
      socketRef.current.off("video-offer")
      socketRef.current.off("video-answer")
      socketRef.current.off("ice-candidate")
    }
  }, [targetUserId, userId])

  //webrtc logics
  const createPeerConnection = () => {
    const pc = new window.RTCPeerConnection(ICE_SERVERS)
    pc.onicecandidate = e => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", {
          targetUserId, candidate: e.candidate, from: { userId, firstName: user.firstName }
        })
      }
    }
    pc.ontrack = e => {
      // Attach remote stream
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
    }
    peerConnectionRef.current = pc
    return pc
  }

  const startCall = async () => {
    setCallStartedByMe(true); setCallRinging(true)
    if (!peerConnectionRef.current) createPeerConnection()
    // Get local video/audio
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    localStreamRef.current = localStream
    localVideoRef.current.srcObject = localStream
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream)
    })
    // Make offer
    const offer = await peerConnectionRef.current.createOffer()
    await peerConnectionRef.current.setLocalDescription(offer)
    socketRef.current.emit("video-offer", {
      targetUserId,
      offer: peerConnectionRef.current.localDescription,
      from: { firstName: user.firstName, userId }
    })
  }

  const hangUp = () => {
    // Stop video, close connection
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop())
    if (peerConnectionRef.current) peerConnectionRef.current.close()
    peerConnectionRef.current = null
    setInCall(false); setCallRinging(false); setCallStartedByMe(false)
    // Optional: emit hangup event to other side and handle 
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-3" style={{ background: "#f6fbff" }}>
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#e4e7ee] shadow-xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ee]">
          <span className="text-2xl font-bold tracking-tight text-[#16a3bb]">
            {targetUser ? `Chat with ${targetUser.firstName}` : 'Chat'}
          </span>
          <div className='flex flex-row justify-center items-center'>
             <button
              onClick={startCall}
              className="bg-[#16a3bb] text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-[#1294a6] transition"
              disabled={inCall || callRinging}
            >📹 Video Call</button>
            <span className="text-sm text-gray-500">
              {onlineStatus
                ? <span className="text-green-500 font-semibold">Online</span>
                : targetUser?.lastSeen
                  ? `Last seen ${formatLastSeen(new Date(targetUser.lastSeen))}`
                  : ''}
            </span>
            <div className="flex items-center gap-2">
              {/* Show avatar initials or icon */}
              <div className="w-9 h-9 rounded-full bg-[#e4e7ee] flex items-center justify-center text-[#16a3bb] font-bold text-lg">
                {user.firstName && user.firstName[0]}
              </div>
            </div>
          </div>
        </div>

         {/* VIDEO CALL UI */}
        {(inCall || callRinging) && (
          <div className="p-4 border-b border-[#e4e7ee] flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">
              {callRinging && callStartedByMe && "Calling..."}
              {callRinging && !callStartedByMe && "Incoming call..."}
              {inCall && "In Video Call"}
            </div>
            <div className="flex gap-3 justify-center items-center">
              <video ref={localVideoRef} autoPlay muted className="w-56 h-40 bg-[#e6e6e6] rounded-xl border-2" />
              <video ref={remoteVideoRef} autoPlay className="w-56 h-40 bg-[#e0ffe6] rounded-xl border-2" />
            </div>
            <button
              className="mt-3 bg-[#fc787a] text-white px-5 py-2 rounded-lg shadow hover:bg-[#fa5151] font-semibold"
              onClick={hangUp}
            >End Call</button>
          </div>
        )}

        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 scrollbar-none">
          {messages.map((msg, idx) => {
            const isCurrentUser = user.firstName === msg.firstName;
            return (
              <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-center justify-center gap-2 max-w-[80%]">
                  {!isCurrentUser && (
                    <img
                      src={targetUser.photoUrl}
                      alt={msg.firstName}
                      className="w-8 h-8 rounded-full object-cover bg-[#e4e7ee] shadow-sm"
                    />
                  )}
                  <div className={`px-4 py-3 text-[16px] 
                    ${isCurrentUser
                      ? 'bg-[#16a3bb] text-white rounded-t-2xl rounded-bl-2xl'
                      : 'bg-[#f4fafe] text-[#1e293b] rounded-t-2xl rounded-br-2xl border border-[#e4e7ee]'
                    } shadow-sm`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isTargetTyping && (
            <div className="flex items-center gap-2 text-sm text-gray-400 pl-3">
              <span>{typingUser} is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-4 py-4 border-t border-[#e4e7ee] bg-[#f6fbff]">
          <form className="flex items-center gap-2"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <input
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Message"
              className="flex-1 bg-white border border-[#e4e7ee] text-[#1e293b] rounded-full px-5 py-3 text-[16px] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#16a3bb] focus:border-[#16a3bb] transition"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-[#fc787a] hover:bg-[#ff6767] active:bg-[#fa5151] text-white font-bold rounded-full text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
            >Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat