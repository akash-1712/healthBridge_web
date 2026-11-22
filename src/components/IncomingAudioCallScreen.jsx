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
import toast from 'react-hot-toast';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

const ParticipantCard = ({ participant, sessionId }) => {
  const call = useCall();
  const audioRef = useRef(null);

  useEffect(() => {
    if (!call || !audioRef.current || !sessionId) {
      return;
    }

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

  const hasAudio = participant.audioStream !== undefined;
  const isMuted = !participant.publishedTracks || participant.publishedTracks.length === 0;

  return (
    <div className="bg-neutral-800/50 backdrop-blur-md p-8 rounded-2xl w-72 text-center border border-neutral-700">
      <audio ref={audioRef} autoPlay playsInline style={{ display: 'none' }} />

      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
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

      <p className="font-semibold text-lg mb-2 text-white">
        {participant.name || participant.userId || 'Anonymous'}
      </p>

      <div className="flex items-center justify-center gap-2">
        {!isMuted && hasAudio ? (
          participant.isSpeaking ? (
            <span className="text-success-400 flex items-center gap-1 animate-pulse">
              🎤 Speaking
            </span>
          ) : (
            <span className="text-neutral-400">🎤 Connected</span>
          )
        ) : (
          <span className="text-danger-400">🔇 Muted</span>
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
  const navigate = useNavigate();

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
      navigate('/');
    } catch (error) {
      toast.error("Call can't be left");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-900 to-purple-900 text-white overflow-auto">
      {/* Header */}
      <div className="p-4 text-center border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-1">Audio Call</h2>
        <p className="text-xs text-neutral-400 mt-2">
          {participants.length} participant{participants.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Participants */}
      <div className="flex-1 flex flex-col md:flex-row md:gap-4 justify-center items-center space-y-6 md:space-y-0 p-6">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.sessionId}
            participant={participant}
            sessionId={participant.sessionId}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="fixed left-0 right-0 bottom-0 p-4 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <Button
            variant={isMute ? 'danger' : 'primary'}
            size="xl"
            onClick={toggleMicrophone}
            aria-label={isMute ? 'Unmute' : 'Mute'}
            className="w-16 h-16 p-0 flex items-center justify-center rounded-full"
          >
            {isMute ? '🔇' : '🎤'}
          </Button>

          <Button
            variant="danger"
            size="xl"
            onClick={handleLeaveCall}
            aria-label="End Call"
            className="w-16 h-16 p-0 flex items-center justify-center rounded-full"
          >
            📞
          </Button>
        </div>
      </div>
    </div>
  );
};

const AudioCallPanel = () => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const isCallCreatedByMe = call?.isCreatedByMe || false;
  const navigate = useNavigate();

  // Only show incoming call UI when call is ringing and not created by current user
  if (callingState === CallingState.RINGING && !isCallCreatedByMe) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-neutral-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center w-full max-w-md mx-auto border border-neutral-700">
          <div className="mb-6">
            <Avatar name="Incoming Call" size="2xl" status="online" className="mx-auto mb-4">
              👨‍⚕️
            </Avatar>
            <h2 className="text-2xl font-bold text-white mb-2">Incoming Audio Call</h2>
            <p className="text-neutral-400">Doctor is calling...</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="danger"
              size="lg"
              fullWidth={false}
              onClick={() => {
                call.leave();
                navigate('/');
              }}
              className="flex-1"
            >
              📞 Decline
            </Button>
            <Button
              variant="success"
              size="lg"
              fullWidth={false}
              onClick={async () => {
                await call.join();
              }}
              className="flex-1"
            >
              🎤 Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active audio call UI
  if (callingState === CallingState.JOINED) {
    return <ActiveAudioCallUI />;
  }

  return null;
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