// src/components/IncomingAudioCallScreen.jsx
import React, { useEffect, useRef } from 'react';
import {
  CallingState,
  StreamCall,
  useCall,
  useCalls,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AudioCallPanel = () => {
  const call = useCall();
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { microphone, isMute } = useMicrophoneState();
  const isCallCreatedByMe = call?.isCreatedByMe || false;

  // Only show incoming call UI when call is ringing and not created by current user
  if (callingState === CallingState.RINGING && !isCallCreatedByMe) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4">
          <div className="mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Incoming Call</h2>
            <p className="text-gray-600">Doctor is calling...</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              className="px-8 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-semibold"
              onClick={() => call.leave()}
            >
              Decline
            </button>
            <button 
              className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-semibold"
              onClick={async () => {
                await call.join();
                // await call.microphone.enable();
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      // <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      //   <div className="text-center">
      //     {/* Caller Avatar */}
      //     <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center animate-pulse">
      //       <span className="text-6xl">📞</span>
      //     </div>

      //     {/* Caller Info */}
      //     <h2 className="text-3xl font-bold text-white mb-2">
      //       {call?.state?.createdBy?.name || 'Doctor'} is calling...
      //     </h2>
      //     <p className="text-xl text-gray-300 mb-8">Audio Call</p>

      //     {/* Action Buttons */}
      //     <div className="flex gap-6 justify-center">
      //       {/* Accept Button */}
      //       <button
      //         onClick={async () => {
      //           await call.join();
      //           // await call.microphone.enable();
      //         }}
      //         className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
      //       >
      //         <span className="flex items-center gap-2">
      //           <span className="text-2xl">✓</span>
      //           <span>Accept</span>
      //         </span>
      //       </button>

      //       {/* Reject Button */}
      //       <button
      //         onClick={() => call.leave()}
      //         className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
      //       >
      //         <span className="flex items-center gap-2">
      //           <span className="text-2xl">✕</span>
      //           <span>Decline</span>
      //         </span>
      //       </button>
      //     </div>
      //   </div>
      // </div>
    );
  }

  // Active audio call UI
  if (callingState === CallingState.JOINED) {
    return <ActiveAudioCallUI />;
  }

  return null;
};

const ParticipantCard = ({ participant, sessionId }) => {
  const call = useCall();
  const audioRef = useRef(null);

  // Bind audio element to participant's audio track
  useEffect(() => {
    if (!call || !audioRef.current || !sessionId) {
      return;
    }

    // Bind the audio element to this participant's audio track
    const cleanup = call.bindAudioElement(
      audioRef.current,
      sessionId,
      'audioTrack'
    );

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [call, sessionId, participant.sessionId]);

  // Check if participant has audio enabled
  const hasAudio = participant.audioStream !== undefined;
  const isMuted = !participant.publishedTracks || participant.publishedTracks.length === 0;

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-72 text-center border border-white/20">
      {/* Hidden audio element for playing remote audio */}
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />

      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        {participant.image ? (
          <img
            src={participant.image}
            alt={participant.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-4xl">👤</span>
        )}
      </div>

      <p className="font-semibold text-lg mb-2">
        {participant.name || participant.userId || 'Anonymous'}
      </p>

      <div className="flex items-center justify-center gap-2">
        {!isMuted && hasAudio ? (
          participant.isSpeaking ? (
            <span className="text-green-400 flex items-center gap-1 animate-pulse">
              🎤 Speaking
            </span>
          ) : (
            <span className="text-gray-400">🎤 Connected</span>
          )
        ) : (
          <span className="text-red-400">🔇 Muted</span>
        )}
      </div>
    </div>
  );
};

const ActiveAudioCallUI = () => {
  const call = useCall();
  const { useParticipants, useMicrophoneState } = useCallStateHooks();
  const participants = useParticipants();
  const { microphone, isMute } = useMicrophoneState();

  const toggleMicrophone = async () => {
    if (isMute) {
      await microphone.enable();
    } else {
      await microphone.disable();
    }
  };

  const handleLeaveCall = async () => {
    try {
      await call.leave();
      
    } catch (error) {
      toast.error("Call can't be left");       
    }
};


  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-auto">
      {/* Header */}
      <div className="p-2 text-center border-b border-white/10">
        <h2 className="text-2xl font-bold mb-1">Audio Call</h2>
        <p className="text-xs text-gray-400 mt-2">
          {participants.length} participant{participants.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Participants */}
      <div className="flex-1 flex flex-col md:flex-row md:gap-[10px] justify-center items-center justify-center space-y-6 md:space-y-0 p-6">
        {participants.map((participant) => (
          <ParticipantCard
          key={participant.sessionId}
          participant={participant}
          sessionId={participant.sessionId}
        />
        ))}
      </div>

      {/* Controls */}
      <div className="fixed left-0 right-0 bottom-0 p-2 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="flex justify-center gap-6">
          {/* Microphone Toggle */}
          <button
            onClick={toggleMicrophone}
            className={`p-4 rounded-full transition-all ${
              isMute
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title={isMute ? 'Unmute' : 'Mute'}
          >
            <span className="text-2xl">{isMute ? '🔇' : '🎤'}</span>
          </button>

          {/* End Call */}
          <button
            onClick={handleLeaveCall}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all"
            title="End Call"
          >
            <span className="text-2xl">📞</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const IncomingAudioCallScreen = () => {
  const { user } = useAuth();
  const calls = useCalls();

  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const audioCall = calls.find(call => call.type === 'audio_room');

  if (!audioCall) {
    navigate('/');
    return null;
  }

  return (
    <StreamCall call={audioCall}>
      <AudioCallPanel />
    </StreamCall>
  );
};

export default IncomingAudioCallScreen;
