// src/components/ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import '../App.css';

import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { getChatId } from "../../util/getChatId";
import { formatDate } from "../../util/formatDate";
import { useChat } from "../contexts/ChatContext";

const env = import.meta.env.VITE_NODE_ENV;

export default function ChatPage() {
  let { channelId } = useParams();
  channelId = getChatId(channelId);

  const location = useLocation();

  const {
    childInfo = null,
    symptomList = null,
    thermoReading = null,
    oxiReading = null,
    callToDoctor = false
  } = location.state || {};

  const {chatClient, setChatClient} = useChat();


  const { user, streamtoken } = useAuth();
  const navigate = useNavigate();
  // const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingCall, setRequestingCall] = useState(false);

  const [callTimer, setCallTimer] = useState(0); // Timer in seconds

  const checkLastCallRequestWithSearch = (ch) => {

    try {
      const savedTimestamp = localStorage.getItem('timer');

      if (!savedTimestamp) {
        return 0;
      }

      const lastRequestTime = parseInt(savedTimestamp, 10);
      const timePassed = Date.now() - lastRequestTime;
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      const remaining = fifteenMinutes - timePassed;

      if (remaining > 0) {
        return Math.ceil(remaining / 1000); // Return remaining seconds
      } else {
        // Timer expired, clean up localStorage
        localStorage.removeItem('timer');
        return 0;
      }
    } catch (error) {
      console.error('Error searching call requests:', error);
      return 0;
    }
  };

  // Update timer - FIX: Use setCallTimer instead of setTimeLeft
  const updateTimer = (ch) => {
    const remaining = checkLastCallRequestWithSearch(ch);
    setCallTimer(remaining); // FIXED: Use callTimer state
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

  // Add useEffect for countdown timer
  useEffect(() => {
    let interval = null;

    if (callTimer > 0) {
      interval = setInterval(() => {
        setCallTimer(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            // Timer finished, clean up localStorage
            clearCallRequestTimestamp();
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    // Cleanup interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callTimer]);

  // Helper function to format timer (MM:SS)
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
  
        // If no client in context, create and connect
        if (!client) {
          let key = null;
          if (env === "dev") {
            key = import.meta.env.VITE_STREAM_CHAT_KEY;
          } else {
            const keyResponse = await fetch(`/api/getStreamKey`, {
              method: 'POST'
            });
            const keyData = await keyResponse.json();
  
            if (!keyResponse.ok) {
              throw new Error(keyData.error || "Failed to fetch Stream key");
            }
            key = keyData.key;
          }
  
          client = StreamChat.getInstance(key);
          
          // Connect user
          await client.connectUser(
            { id: user.id, name: user.name },
            streamtoken
          );
  
          setChatClient(client);
        } else {
          // Client exists - check if user is connected
          // KEY FIX: Check if THIS user is connected
          if (client.userID !== user.id) {
            // Different user or not connected - reconnect
            if (client.userID) {
              await client.disconnectUser();
            }
            
            await client.connectUser(
              { id: user.id, name: user.name },
              streamtoken
            );
          }
          // If client.userID === user.id, user is already connected
        }
  
        // Now get the channel (user is definitely connected)
        const ch = client.channel('messaging', channelId);
        await ch.watch();
  
        setChannel(ch);
  
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
      // Don't disconnect here - keep user connected for app
      // Only disconnect when user logs out
    };
  }, [user, channelId, streamtoken, navigate]);
  

  const requestCallToDoctor = async () => {
    if (!channel || !user) {
      toast.error("Unable to send call request");
      return;
    }

    setRequestingCall(true);

    try {
      // Send call request message in the current chat

      await channel.sendMessage({
        customField: "123",
        text: `Hello, Doctor! A consultation is requested with the following Child information: \n\n**Date:** ${formatDate(new Date())}\n\n**Child Information**
       Name: ${childInfo?.name || 'N/A'}
      Age: ${childInfo?.age || 'N/A'} years
      Gender: ${childInfo?.gender || 'N/A'}
      Weight: ${childInfo?.weight || 'N/A'} kg
      Height: ${childInfo?.height || 'N/A'} cm
      \n**Reported Symptoms**
      ${Array.isArray(symptomList) ? symptomList.map(symptom => `${symptom}`).join('\n') : " None provided"}
      \n**Thermometer Reading:** ${thermoReading || "N/A"} °C
      **Oximeter Reading:** ${oxiReading || "N/A"} SpO₂
      \nTeam HealthBridge`
      });

      saveCallRequestTimestamp();
      setCallTimer(15 * 60);

      toast.success("Call request sent to doctor!");

    } catch (error) {
      console.error("Error requesting call:", error);
      toast.error("Failed to request call. Please try again.");
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

  // Scroll to bottom when chat loads and when new messages arrive
  useEffect(() => {
    if (chatClient && channel && !loading) {
      // Scroll to bottom after chat is fully loaded
      setTimeout(scrollToBottom, 100);
    }
  }, [chatClient, channel, loading]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Chat not available</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[88vh] md:h-[91vh] lg:h-[90vh] flex flex-col overflow-y-scroll">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sm:ml-0 sticky top-0 z-40 w-full">
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 text-lg flex items-center gap-1 md:ml-[150px] ml-0"
        >
          ← <span className="hidden md:inline">Back to Home</span>
        </button>
        <h1 className="md:text-3xl text-xl font-bold text-blue-900 text-center flex-end">
                  Dr. Manju Dutta
                </h1>
        {callToDoctor && <button
          onClick={requestCallToDoctor}
          disabled={requestingCall || callTimer > 0}
          className={`px-4 py-2 rounded-lg transition font-semibold ${requestingCall || callTimer > 0
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
              : 'bg-green-400 text-white hover:bg-green-600'
            }`}
        >
          {requestingCall ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Requesting...
            </div>
          ) : callTimer > 0 ? (
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span className="md:inline hidden">Request Again in: </span>
              <span>{formatTimer(callTimer)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span className="hidden md:inline">Request Call</span>
            </div>
          )}
        </button>}
      </div>



      {/* Chat UI */}
      <div className="flex-1">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
