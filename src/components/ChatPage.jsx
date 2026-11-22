// src/components/ChatPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
  Message,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getChatId } from '../../util/getChatId';
import { formatDate } from '../../util/formatDate';
import { useChat } from '../contexts/ChatContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import LoadingSpinner from './ui/LoadingSpinner';
import { buildApiUrl } from '../util/api';

// Custom Channel Header
const CustomChannelHeader = () => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary bg-bg-secondary">
    <Avatar
      name="Dr. Manju Dutta"
      size="lg"
      status="online"
    >
      👨‍⚕️
    </Avatar>
    <div className="flex-1 min-w-0">
      <h2 className="font-semibold text-text-primary truncate">Dr. Manju Dutta</h2>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Badge variant="success" size="sm" dot>Online</Badge>
        <span>Pediatrician</span>
      </div>
    </div>
  </div>
);

// Custom Message Component
const CustomMessage = ({ message, currentUserId }) => {
  const isOwn = message.user?.id === currentUserId;
  const isSystem = message.type === 'system' || message.customField === '123';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-bg-tertiary rounded-xl px-4 py-2 max-w-[80%]">
          <p className="text-sm text-text-secondary whitespace-pre-wrap text-center">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-2
          ${isOwn
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-bg-tertiary text-text-primary rounded-tl-sm'
          }
        `}
      >
        {!isOwn && (
          <div className="text-xs text-text-muted mb-1 ml-1">
            {message.user?.name || 'Unknown'}
          </div>
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 text-xs ${isOwn ? 'justify-end text-primary-100' : 'justify-start text-text-muted'}`}>
          <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwn && message.read_by && Object.keys(message.read_by).length > 0 && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom Message Input
const CustomMessageInput = ({ channel }) => {
  const [text, setText] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await channel.sendMessage({ text });
    setText('');
  };

  return (
    <form onSubmit={handleSend} className="p-4 border-t border-border-primary bg-bg-secondary">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-bg-primary border border-border-primary rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent"
          disabled={!channel}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!text.trim() || !channel}
          className="flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>
    </form>
  );
};

export default function ChatPage() {
  let { channelId } = useParams();
  channelId = getChatId(channelId);

  const location = useLocation();

  const {
    childInfo = null,
    symptomList = null,
    thermoReading = null,
    oxiReading = null,
    callToDoctor = false,
  } = location.state || {};

  const { chatClient, setChatClient } = useChat();

  const { user, streamtoken } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingCall, setRequestingCall] = useState(false);

  const [callTimer, setCallTimer] = useState(0);

  const checkLastCallRequestWithSearch = () => {
    try {
      const savedTimestamp = localStorage.getItem('timer');

      if (!savedTimestamp) {
        return 0;
      }

      const lastRequestTime = parseInt(savedTimestamp, 10);
      const timePassed = Date.now() - lastRequestTime;
      const fifteenMinutes = 15 * 60 * 1000;
      const remaining = fifteenMinutes - timePassed;

      if (remaining > 0) {
        return Math.ceil(remaining / 1000);
      } else {
        localStorage.removeItem('timer');
        return 0;
      }
    } catch (error) {
      console.error('Error searching call requests:', error);
      return 0;
    }
  };

  const updateTimer = () => {
    const remaining = checkLastCallRequestWithSearch();
    setCallTimer(remaining);
  };

  const saveCallRequestTimestamp = () => {
    try {
      const timestamp = Date.now().toString();
      localStorage.setItem('timer', timestamp);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const clearCallRequestTimestamp = () => {
    try {
      localStorage.removeItem('timer');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  useEffect(() => {
    let interval = null;

    if (callTimer > 0) {
      interval = setInterval(() => {
        setCallTimer(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            clearCallRequestTimestamp();
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callTimer]);

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !channelId || !streamtoken) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);

        let client = chatClient;

        if (!client) {
          let key = null;
          if (import.meta.env.VITE_NODE_ENV === 'dev') {
            key = import.meta.env.VITE_STREAM_CHAT_KEY;
          } else {
            const keyResponse = await fetch(buildApiUrl('getStreamKey'), { method: 'POST' });
            const keyData = await keyResponse.json();

            if (!keyResponse.ok) {
              throw new Error(keyData.error || 'Failed to fetch Stream key');
            }
            key = keyData.key;
          }

          client = StreamChat.getInstance(key);

          await client.connectUser(
            { id: user.id, name: user.name },
            streamtoken
          );

          setChatClient(client);
        } else {
          if (client.userID !== user.id) {
            if (client.userID) {
              await client.disconnectUser();
            }

            await client.connectUser(
              { id: user.id, name: user.name },
              streamtoken
            );
          }
        }

        const ch = client.channel('messaging', channelId);
        await ch.watch();

        setChannel(ch);
        updateTimer();

      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast.error('Failed to load chat');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      // Keep user connected
    };
  }, [user, channelId, streamtoken, navigate]);

  const requestCallToDoctor = async () => {
    if (!channel || !user) {
      toast.error('Unable to send call request');
      return;
    }

    setRequestingCall(true);

    try {
      await channel.sendMessage({
        customField: '123',
        text: `Hello, Doctor! A consultation is requested with the following Child information: \n\n**Date:** ${formatDate(new Date())}\n\n**Child Information**\nName: ${childInfo?.name || 'N/A'}\nAge: ${childInfo?.age || 'N/A'} years\nGender: ${childInfo?.gender || 'N/A'}\nWeight: ${childInfo?.weight || 'N/A'} kg\nHeight: ${childInfo?.height || 'N/A'} cm\n\n**Reported Symptoms**\n${Array.isArray(symptomList) ? symptomList.map(symptom => `${symptom}`).join('\n') : ' None provided'}\n\n**Thermometer Reading:** ${thermoReading || 'N/A'} °C\n**Oximeter Reading:** ${oxiReading || 'N/A'} SpO₂\n\nTeam HealthBridge`,
      });

      saveCallRequestTimestamp();
      setCallTimer(15 * 60);

      toast.success('Call request sent to doctor!');
    } catch (error) {
      console.error('Error requesting call:', error);
      toast.error('Failed to request call. Please try again.');
    } finally {
      setRequestingCall(false);
    }
  };

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (chatClient && channel && !loading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatClient, channel, loading]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Chat not available</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      {/* Custom Header */}
      <div className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur-md border-b border-border-primary">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex-shrink-0"
          >
            ← Back
          </Button>

          <CustomChannelHeader channel={channel} />

          {callToDoctor && (
            <Button
              variant={requestingCall || callTimer > 0 ? 'outline' : 'success'}
              size="sm"
              onClick={requestCallToDoctor}
              disabled={requestingCall || callTimer > 0}
              className="flex-shrink-0"
            >
              {requestingCall ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Requesting...
                </>
              ) : callTimer > 0 ? (
                <>
                  <span className="mr-2">⏱️</span>
                  {formatTimer(callTimer)}
                </>
              ) : (
                <>
                  <span className="mr-2">📞</span>
                  Request Call
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Chat UI */}
      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader Component={CustomChannelHeader} />
              <MessageList>
                <Message Component={CustomMessage} />
              </MessageList>
              <MessageInput Component={CustomMessageInput} />
            </Window>
            <Thread />
          </Channel>
        </Chat>

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}