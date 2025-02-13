import React, { useEffect, useState } from 'react'
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

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`,
        {withCredentials:true}
      )

      console.log(chat.data.messages) 

      const chatMessages = chat?.data?.messages.map((msg) => {
        const {senderId, text} = msg
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
    if(!userId){
      return; 
    }
    const socket = createSocketConnection()
    //As soon as the page loads , the socket connection is made and joinChat event is emitted
    socket.emit('joinChat', {firstName : user.firstName, userId ,targetUserId})

    socket.on('messageReceived', ({firstName, lastName ,text}) => {
      console.log(firstName+" "+ text)
      setMessages((messages)=>[...messages, {firstName,lastName, text}])
    })


    return () => {
      socket.disconnect()
    }
  }, [userId, targetUserId])

  const sendMessage = () => {
    const socket = createSocketConnection()
    //emit the sendMessage event to the server
    socket.emit('sendMessage', { firstName: user.firstName, lastName: user.lastName ,userId, targetUserId, text: newMessage })
    setNewMessage('')
  }
  return (
    <div className='w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col'>
      <h1 className='p-5 border-b border-gray-600'>Chat</h1>
      <div className='flex-1 overflow-scroll p-5'>
        {messages.map((msg, index) => {
          return (
            <div key={index}
            className={
              "chat "+
              (user.firstName === msg.firstName? "chat-end" : "chat-start")
              }>
              <div className="chat-header">
                {msg.firstName + " " + msg.lastName} 
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          );
        })
        }
      </div>
      <div className='p-5 border-t border-gray-600 flex items-center gap-2'>
        <input 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)}
        className='flex-1 border border-gray-500 text-black rounded p-2'></input>
        <button onClick={sendMessage} className='btn btn-secondary'>Send</button>
      </div>

    </div>
  )
}

export default Chat