// src/contexts/CallProvider.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCalls, CallingState } from '@stream-io/video-react-sdk';

export default function CallProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, streamtoken } = useAuth();
  const isOnCallScreen = location.pathname === '/call';
  const isOnAudioCallScreen = location.pathname === '/audio-call';

  

  if(!user || !streamtoken) {
    return children;
  }

  const calls = useCalls();
  const call = calls.length > 0 ? calls[0]:null;
  const callingState = call?.state.callingState;

  // Determine if this is an audio or video call
  const isAudioCall = call?.type === 'audio_room';
  const isVideoCall = call?.type === 'default';

  useEffect(() => {
    if (!user || !call) {
      return;
    }

    // console.log('CallProvider - call detected:', { 
    //   callId: call.id, 
    //   callingState,
    //   isOnCallScreen,
    //   isCreatedByMe: call.isCreatedByMe 
    // });

    if (callingState === CallingState.ENDED) {
      // console.log('Call ended, navigating home');
      navigate('/');
      return;
    }

    // if (!isOnCallScreen && callingState === CallingState.RINGING && !call.isCreatedByMe) {
    //   // console.log('Incoming call, navigating to /call');
    //   navigate('/call');
    // }

    if (callingState === CallingState.RINGING && !call.isCreatedByMe) {
      // Navigate to appropriate call screen based on call type
      if (isAudioCall && !isOnAudioCallScreen) {
        console.log('Incoming AUDIO call, navigating to /audio-call');
        navigate('/audio-call');
      } else if (isVideoCall && !isOnCallScreen) {
        console.log('Incoming VIDEO call, navigating to /call');
        navigate('/call');
      }
    }
  }, [call, isOnCallScreen, callingState, user, navigate]);

  return (
    <>
      {children}
      {user && call && !isOnAudioCallScreen && !isOnCallScreen && callingState !== CallingState.ENDED && (
        <div
          onClick={() => navigate('/call')}
          style={{
            position: 'fixed',
            backgroundColor: '#22c55e',
            color: 'white',
            top: 20,
            left: 20,
            right: 20,
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          📞 Incoming Call - Click to Answer ({callingState})
        </div>
      )}
    </>
  );
}
