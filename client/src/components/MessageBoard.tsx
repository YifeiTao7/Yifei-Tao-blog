import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../axios.config';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [formData, setFormData] = useState({ message: '' });
  // eslint-disable-next-line no-unused-vars
  const [initialLoad, setInitialLoad] = useState(true);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get<Message[]>(`messages/${projectId}`);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };
  

  useEffect(() => {
    fetchMessages();
  }, [projectId]);

useEffect(() => {
  if (!initialLoad && scrollToBottom && messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    setScrollToBottom(false);
  }
}, [messages, scrollToBottom, initialLoad]);


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a message.');
      return;
    }
    
    const updatedFormData = {
      ...formData,
      username: user.username,
      avatarUrl: user.avatar || 'default-avatar.png'
    };
  
    try {
      const response = await axiosInstance.post(`messages/submit/${projectId}`, updatedFormData);
      if (response.data && response.data.message === "Message submitted successfully") {
        toast.success('Your message has been submitted successfully. Thank you!');
        setFormData({ message: '' });
        await fetchMessages();
        setScrollToBottom(true);
      } else {
        toast.error('Failed to submit message');
      }
    } catch (error) {
      toast.error('Failed to submit message');
    }
  };
  
  
  

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="message-board-container">
      <h1 style={{ textAlign: 'center' }}>Message Board</h1>
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
          <button className="link-like-button" onClick={scrollToTop}>
            Please login to leave a message.
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MessageBoard;
