import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'

const Chat = () => {
  const { targetUserId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const user = useSelector(store => store.user)
  const userId = user?._id;

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTyping = useRef(false);
  const messagesEndRef = useRef(null);

  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  const [inCall, setInCall] = useState(false)
  const [callStartedByMe, setCallStartedByMe] = useState(false)
  const callStartedByMeRef = useRef(false); // Add this ref
  const [callRinging, setCallRinging] = useState(false)
  const [remoteUserName, setRemoteUserName] = useState('')
  const [callerId, setCallerId] = useState(null);

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)

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

  useEffect(() => { fetchChatMessages() }, [])

  const handleCallAccepted = async () => {
    console.log("[CALL ACCEPTED] callStartedByMe=", callStartedByMe);
    setInCall(true);
    setCallRinging(false);

    if (callStartedByMeRef.current) {
      try {
        console.log("🟢 INITIATING WebRTC as caller");
        await initiateWebRTC(true);
      } catch (error) {
        console.error("Error starting WebRTC:", error);
        hangUp();
      }
    }
  };

  //socket + signaling
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection()
    socketRef.current = socket

    socket.emit('joinChat', { firstName: user.firstName, userId, targetUserId })
    socket.emit('setOnline', userId);
    socket.emit('getUserStatus', targetUserId);

    socket.on('messageReceived', ({ firstName, lastName, text }) => {
      console.log(firstName + " " + text)
      setMessages((messages) => [...messages, { firstName, lastName, text }])
    })

    socket.on('typing', ({ firstName }) => {
      console.log('Received typing event from', firstName);
      setTypingUser(firstName);
      setIsTargetTyping(true);
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

    socket.on("incomingCall", ({ from }) => {
      console.log("[INCOMING CALL]", from);
      setCallerId(from.userId);
      setRemoteUserName(from.firstName);
      setCallRinging(true);
      setCallStartedByMe(false);
      callStartedByMeRef.current = false;
    });

    // Other user accepted
    socket.on("callAccepted", handleCallAccepted);

    // Other user rejected
    socket.on("callRejected", ({ busy }) => {
      console.log("[CALL REJECTED]", busy ? "User busy" : "");
      setCallRinging(false);
      setCallStartedByMe(false);
      alert("Call was rejected");
    });

    // Missed call handler
    socket.on("missedCall", () => {
      setCallRinging(false);
      setCallStartedByMe(false);
      alert("Missed Call");
    });

    // Remote user ended call
    socket.on("callEnded", () => {
      cleanupCall();
      alert("Call ended by remote user");
    });

    socket.on("video-offer", async ({ offer, from }) => {
      try {
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

        socketRef.current?.emit('video-answer', {
          targetUserId: from.userId,
          answer: peerConnectionRef.current.localDescription,
          from: { firstName: user.firstName, userId }
        })

        setInCall(true)
        setCallRinging(false)
      } catch (err) {
        console.error('Error handling video-offer:', err)
        // Optional: tell caller we failed to get media, reject call gracefully
        rejectCall()
      }
    })

    socket.on("video-answer", async ({ answer }) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(answer)
          setInCall(true)
          setCallRinging(false)
        }
      } catch (err) {
        console.error('Error handling video-answer:', err)
      }
    })

    socket.on("ice-candidate", ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        peerConnectionRef.current.addIceCandidate(candidate).catch(console.error)
      }
    })

    return () => {
      socket.off('messageReceived')
      socket.off('typing')
      socket.off('stopTyping')
      socket.off('userStatusResponse')
      socket.off('userStatusChanged')
      socket.off('incomingCall')
      socket.off('callAccepted')
      socket.off('callRejected')
      socket.off('missedCall')
      socket.off('callEnded')
      socket.off('video-offer')
      socket.off('video-answer')
      socket.off('ice-candidate')

      clearTimeout(typingTimeoutRef.current)
      cleanupCall()
      socket.disconnect()
    }
  }, [userId, targetUserId])

  //webrtc logics
  const createPeerConnection = () => {
    const pc = new window.RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = e => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", {
          targetUserId,
          candidate: e.candidate,
          from: { userId, firstName: user.firstName }
        })
      }
    }
    pc.ontrack = e => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
    }
    peerConnectionRef.current = pc
    return pc
  }

  const initiateWebRTC = async (isCaller) => {
    try {
      if (!peerConnectionRef.current) createPeerConnection()

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = localStream
      console.log("Local stream obtained:", localStream);
      console.log("Local video ref:", localVideoRef.current)

      if (localVideoRef.current) localVideoRef.current.srcObject = localStream
      localStream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, localStream))

      if (isCaller) {
        const offer = await peerConnectionRef.current.createOffer()
        await peerConnectionRef.current.setLocalDescription(offer)
        socketRef.current?.emit("video-offer", {
          targetUserId,
          offer: peerConnectionRef.current.localDescription,
          from: { firstName: user.firstName, userId }
        })
      }
    } catch (err) {
      console.error('Error starting WebRTC:', err)
      // If media fails, tell remote and reset UI
      rejectCall()
    }
  }

  const startCall = async () => {
    console.log("🟢 STARTING CALL - Setting refs and state");
    setCallStartedByMe(true);
    callStartedByMeRef.current = true;
    setCallRinging(true);

    socketRef.current.emit("callInitiated", {
      targetUserId,
      from: { firstName: user.firstName, userId }
    })
  }

  const acceptCall = async () => {
    console.log("[ACCEPT CALL] sending to targetUserId:", targetUserId, "myId:", userId);
    socketRef.current.emit("callAccepted", {
      targetUserId: callerId || targetUserId,
      from: { firstName: user.firstName, userId }
    });

    setInCall(true);
    setCallRinging(false);
  };

  const rejectCall = () => {
    socketRef.current.emit("callRejected", {
      targetUserId,
      from: { firstName: user.firstName, userId }
    });
    setCallRinging(false);
    setCallStartedByMe(false);
    callStartedByMeRef.current = false;
  };

  const hangUp = () => {
    cleanupCall()
    socketRef.current.emit("callEnded", {
      targetUserId,
      from: { userId, firstName: user.firstName }
    })
  }

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
      localStreamRef.current = null
    }
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    setInCall(false)
    setCallRinging(false)
    setCallStartedByMe(false)
    callStartedByMeRef.current = false;
  }

  // presence helper
  useEffect(() => {
    if (!socketRef.current || !userId) return;

    socketRef.current.emit('setOnline', userId);
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

  // message end ref
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTargetTyping]);



  return (
    <div className="min-h-screen flex items-center justify-center p-3" style={{ background: "#f6fbff" }}>
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#e4e7ee] shadow-xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e7ee]">
          <span className="text-2xl font-bold tracking-tight text-[#16a3bb]">
            {targetUser ? `Chat with ${targetUser.firstName}` : 'Chat'}
          </span>

          {/* Incoming Call UI */}
          {callRinging && !callStartedByMe && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-alibaba">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 border border-lightGray">
                <div className="text-center mb-6">
                  <h2 className="text-[36px] font-bold text-primary mb-3">
                    Incoming Call
                  </h2>
                  <p className="text-[18px] text-textPrimary font-medium mb-2">
                    {remoteUserName}
                  </p>
                  <p className="text-sm text-gray-500">
                    wants to video chat
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={rejectCall}
                    className="px-6 py-3 bg-secondary text-white rounded-[12px] font-medium hover:bg-[#fd4e5c] transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={acceptCall}
                    className="px-6 py-3 bg-primary text-white rounded-[12px] font-medium hover:bg-[#007ea8] transition"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Outgoing Ringing UI */}
          {callRinging && callStartedByMe && !inCall && (
            <div className="bg-white border border-lightGray rounded-[12px] shadow-sm px-4 py-2 font-alibaba">
              <p className="text-sm font-medium text-textPrimary">
                Calling {remoteUserName}...
              </p>
            </div>
          )}

          <div className='flex flex-row justify-center items-center gap-5'>
            <button
              onClick={startCall}
              className="bg-primary text-white px-4 py-3 rounded-[12px] font-medium shadow hover:bg-[#007ea8] transition disabled:opacity-50 font-alibaba"
              disabled={inCall || callRinging}
            >📹 Video Call
            </button>

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
        {(inCall) && (
          <div className="p-4 border-b flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">{inCall && "In Video Call"}</div>
            <div className="flex gap-3">
              <video ref={localVideoRef} autoPlay muted className="w-56 h-40 bg-gray-200 rounded-xl border-2" />
              <video ref={remoteVideoRef} autoPlay className="w-56 h-40 bg-green-50 rounded-xl border-2" />
            </div>
            <button onClick={hangUp} className="mt-3 bg-red-500 text-white px-5 py-2 rounded-lg">End Call</button>
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