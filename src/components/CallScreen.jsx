// src/components/CallScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  StreamCall,
  useCalls,
  useCallStateHooks,
  CallingState,
  CallControls,
  SpeakerLayout,
  useStreamVideoClient,
  useCall,
  StreamTheme,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  CancelCallButton,
  RecordCallButton,
  PaginatedGridLayout,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import '../App.css'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { EmojiPicker } from 'stream-chat-react/emojis';

const CustomTopView = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div style={{
      width: '75%',
      position: 'absolute',
      left: '25%',
      top: 10,
      height: 50,
      backgroundColor: 'rgba(3, 51, 193, 0.48)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      borderRadius: 6,
      border: '2px solid white'
    }}>
      <p style={{
        color: 'white',
        fontSize: 14,
        padding: 10,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {participants.length} participant{participants.length > 1 ? 's' : ''} in the Video Call
      </p>
    </div>
  );
};

const CustomCallControls = (props) => {
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  
  // Get microphone state
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  
  // Get camera state  
  const { camera, isMute: isCameraMuted } = useCameraState();

  const reactions = [
    { type: 'reaction', emoji_code: ':smile:', icon: '😊' },
    { type: 'raised-hand', emoji_code: ':raise-hand:', icon: '✋' },
    { type: 'reaction', emoji_code: ':fireworks:', icon: '🎉' },
    { type: 'reaction', emoji_code: ':like:', icon: '😍' }
  ];

  const sendReaction = (reaction) => {
    call?.sendReaction({
      type: reaction.type,
      emoji_code: reaction.emoji_code,
      custom: {},
      icon: reaction.icon
    });
  };

  return (
    <div style={{
      position: 'absolute',
      left: 10,
      top: 80,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '10px 20px',
      backgroundColor: 'rgba(3, 51, 193, 0.48)',
      borderRadius: 6,
      border: '2px solid white',
      zIndex: 555
    }}>

<button
        onClick={() => microphone.toggle()}
        style={{
          ...styles.controlButton,
          backgroundColor: isMicMuted ? '#ef4444' : '#22c55e'
        }}
        title={isMicMuted ? 'Unmute' : 'Mute'}
      >
        {isMicMuted ? '🔇' : '🎤'}
      </button>

      {/* Custom Video Toggle Button */}
      <button
        onClick={() => camera.toggle()}
        style={{
          ...styles.controlButton,
          backgroundColor: isCameraMuted ? '#ef4444' : '#22c55e'
        }}
        title={isCameraMuted ? 'On Camera' : 'Off Camera'}
      >
        {isCameraMuted ? '📹' : '📷'}
      </button>
      {/* Stream's built-in call controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        <CallControls onLeave={props.onHangupCallHandler} />
      </div>
      
      {/* Custom reaction buttons */}
      <div style={{ display: 'flex', gap: 5 }}>
        {reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => sendReaction(reaction)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              borderRadius: 4,
              padding: '5px 10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: 16
            }}
            title={reaction.emoji_code}
          >
            {reaction.icon}
          </button>
        ))}
      </div>

      {/* Custom End Call Button */}
      <button
        onClick={props.onHangupCallHandler}
        style={{
          backgroundColor: '#ef4444',
          border: 'none',
          borderRadius: 20,
          padding: '10px 20px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        End Call
      </button>
    </div>
  );
};


export const VerticalCallControls = ({ onLeave }) => (
  <div className="flex items-center space-y-10">
    <ToggleAudioPublishingButton />
    <ToggleVideoPublishingButton />
    <ScreenShareButton />
    <RecordCallButton/>
    <CancelCallButton onClick={onLeave} />
  </div>
);


const CallScreen = () => {
  const calls = useCalls();
  const call = calls[0];
  const navigate = useNavigate();

  const handleLeaveCall = async () => {
      try {
        if (call?.state?.callingState !== 'left') {
        await call.leave();
        }
        
      } catch (error) {
        toast.error("Call can't be left");       
      }
  };

  if (!call) {
    navigate('/');
    return null;
  }

  const ActiveCallScreen = ({handleLeaveCall})=> {
    const {useCallCallingState} = useCallStateHooks();
    const client = useStreamVideoClient();
    const callingState = useCallCallingState();

    useEffect(() => {
      const unsubscribe = client.on('all', (event) => {
        if (event.type === 'call.session_participant_joined') {
          const participant = event.participant;
          toast.success(`${participant.user.name || 'Someone'} joined the call`);
        }
        
        if (event.type === 'call.session_participant_left') {
          const participant = event.participant;
          toast.success(`${participant.user.name || 'Someone'} left the call`);
        }
        
        if (event.type === 'call.session_ended') {
          toast.success('Call ended');
          handleCustomLeave();
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, [navigate, callingState]);

    const handleCustomLeave = async () => {
      await handleLeaveCall();
    };

    return (
      (callingState=== CallingState.JOINED) ? (
        <StreamTheme>
    <CallControls onLeave={handleCustomLeave} />
  <SpeakerLayout participantsBarPosition="bottom" />
</StreamTheme>
      ) : (
        <div className="h-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Connecting to call...</p>
            <p className="text-sm mt-2">State: {callingState}</p>
          </div>
        </div>
      )
    )
      }

  return (
    <div className="h-screen w-full bg-gray-900">
      <StreamCall call={call}>
        <ActiveCallScreen handleLeaveCall={handleLeaveCall}/>
      </StreamCall>
    </div>
  );
};

const styles = {
  controlButton: {
    border: 'none',
    borderRadius: 50,
    width: 50,
    height: 50,
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
}

export default CallScreen;
