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
  StreamTheme,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
  CancelCallButton,
  RecordCallButton,
  ParticipantView,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';

const CallScreen = () => {
  const calls = useCalls();
  const call = calls[0];
  const navigate = useNavigate();

  const handleLeaveCall = async () => {
    try {
      if (call?.state?.callingState !== 'left') {
        await call.leave();
      }
      navigate('/');
    } catch {
      toast.error("Call can't be left");
    }
  };

  if (!call) {
    navigate('/');
    return null;
  }

  const ActiveCallScreen = ({ handleLeaveCall }) => {
    const { useCallCallingState, useParticipants, useMicrophoneState, useCameraState } = useCallStateHooks();
    const client = useStreamVideoClient();
    const callingState = useCallCallingState();
    const participants = useParticipants();
    const { microphone, isMute: isMicMuted } = useMicrophoneState();
    const { camera, isMute: isCameraMuted } = useCameraState();

    useEffect(() => {
      const unsubscribe = client.on('all', (event) => {
        if (event.type === 'call.session_participant_joined') {
          const participant = event.participant;
          toast.success(`${participant.user?.name || 'Someone'} joined the call`);
        }

        if (event.type === 'call.session_participant_left') {
          const participant = event.participant;
          toast.success(`${participant.user?.name || 'Someone'} left the call`);
        }

        if (event.type === 'call.session_ended') {
          toast.success('Call ended');
          handleCustomLeave();
        }
      });

      return () => {
        unsubscribe();
      };
    }, [client, callingState, handleLeaveCall]);

    const handleCustomLeave = async () => {
      await handleLeaveCall();
    };

    const handleToggleMic = () => microphone.toggle();
    const handleToggleCamera = () => camera.toggle();
    const handleScreenShare = () => call?.toggleScreenShare();

    // Connecting state
    if (callingState !== CallingState.JOINED) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-neutral-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-xl font-medium">Connecting to call...</p>
            <p className="text-sm text-neutral-400 mt-2">State: {callingState}</p>
          </div>
        </div>
      );
    }

    return (
      <StreamTheme>
        <div className="h-screen w-full bg-neutral-900 relative">
          {/* Video Area */}
          <div className="h-full w-full">
            <SpeakerLayout
              participantView={({ participant }) => (
                <ParticipantView
                  participant={participant}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
              pictureInPicture={false}
              participantsBarPosition="bottom"
            />
          </div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md rounded-xl px-4 py-2 border border-neutral-700">
                <Avatar name="HealthBridge Call" size="md" status="online">
                  🩺
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Video Consultation</p>
                  <p className="text-xs text-neutral-400">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''} in call
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl px-4 py-2 border border-neutral-700 flex items-center gap-2">
                  <Badge variant="success" size="sm" dot>Live</Badge>
                  <span className="text-sm font-mono text-neutral-300" id="call-duration">00:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 pointer-events-none">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 pointer-events-auto">
              {/* Mic Toggle */}
              <Button
                variant={isMicMuted ? 'danger' : 'primary'}
                size="xl"
                onClick={handleToggleMic}
                aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                className="w-16 h-16 p-0 flex items-center justify-center rounded-full"
              >
                {isMicMuted ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </Button>

              {/* Camera Toggle */}
              <Button
                variant={isCameraMuted ? 'danger' : 'primary'}
                size="xl"
                onClick={handleToggleCamera}
                aria-label={isCameraMuted ? 'Turn on camera' : 'Turn off camera'}
                className="w-16 h-16 p-0 flex items-center justify-center rounded-full"
              >
                {isCameraMuted ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m4 0l4-4m-4 4l-4 4m4 0l4 4" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                  </svg>
                )}
              </Button>

              {/* Screen Share */}
              <Button
                variant="secondary"
                size="xl"
                onClick={handleScreenShare}
                aria-label="Share screen"
                className="w-16 h-16 p-0 flex items-center justify-center rounded-full"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Button>

              {/* Leave Call */}
              <Button
                variant="danger"
                size="xl"
                onClick={handleCustomLeave}
                aria-label="Leave call"
                className="w-16 h-16 p-0 flex items-center justify-center rounded-full"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Call Duration Timer */}
          <CallDurationTimer />
        </div>
      </StreamTheme>
    );
  };

  return (
    <div className="h-screen w-full">
      <StreamCall call={call}>
        <ActiveCallScreen handleLeaveCall={handleLeaveCall} />
      </StreamCall>
    </div>
  );
};

// Call Duration Timer Component
const CallDurationTimer = () => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          const el = document.getElementById('call-duration');
          if (el) el.textContent = '${formatTime(duration)}';
        `,
      }}
    />
  );
};

export default CallScreen;