import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axios.config';
import { useAuth } from '../context/AuthContext';
import AuthModalButton from './AuthModalButton';

interface Message {
  _id: string;
  username: string;
  message: string;
  createdAt: string;
  avatarUrl: string; 
}

interface MessageBoardProps {
  projectId: string;
}

const MessageBoard: React.FC<MessageBoardProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [formData, setFormData] = useState({
    message: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get<Message[]>(`/${projectId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      const updatedFormData = { 
        ...formData,
        username: user.username,
        avatarUrl: user.avatar || 'default-avatar.png'  // 使用用户头像或默认头像
      };
      try {
        await axiosInstance.post(`/submit/${projectId}`, updatedFormData);
        alert('Your message has been submitted successfully. Thank you!');
        fetchMessages();
      } catch (error) {
        console.error('Error submitting message:', error);
        alert('There was a problem submitting your message.');
      }
    } else {
      alert('Please login to leave a message.');
    }
  };
  

  return (
    <div className="message-board-container">
      {messages.map((message) => (
        <div key={message._id} className="message-box">
          <div className="message-header">
            <img src={message.avatarUrl || 'default-avatar.png'} alt="user avatar" className="avatar" />
            <h3 className="username">{message.username}</h3>
            <p className="date">{new Date(message.createdAt).toLocaleDateString()}</p>
          </div>
          <p className="message-content">{message.message}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
      {user ? (
        <form onSubmit={handleSubmit} className="message-form">
          <label htmlFor="message">Message</label>
          <textarea className="message-textarea" name="message" id="message" rows={5} required value={formData.message} onChange={handleChange} />
          <button className="send-button" type="submit">Send Message</button>
        </form>
      ) : (
        <div className="auth-message">
          <p>Please </p>
          <AuthModalButton isMessageBoard={true} />
          <p> to leave a message.</p>
        </div>
      )}
    </div>
  );
  
}

export default MessageBoard;
