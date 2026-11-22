// src/components/IncomingCallScreen.jsx
import React from 'react';
import {
  CallingState,
  StreamCall,
  useCall,
  useCalls,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';

const CallPanel = () => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  const isCallCreatedByMe = call?.isCreatedByMe || false;

  // Only show incoming call UI when call is ringing and not created by current user
  if (callingState === CallingState.RINGING && !isCallCreatedByMe) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-bg-secondary rounded-3xl shadow-2xl text-center w-full max-w-md mx-auto border border-border-primary">
          <div className="p-8">
            <div className="mb-6">
              <Avatar name="Incoming Call" size="2xl" status="online" className="mx-auto mb-4">
                👨‍⚕️
              </Avatar>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Incoming Call</h2>
              <p className="text-text-secondary">Doctor is calling...</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="danger"
                size="lg"
                fullWidth={false}
                onClick={() => {
                  call?.leave({ reject: true });
                  navigate('/');
                }}
                className="flex-1"
              >
                <span className="mr-2">📞</span>
                Decline
              </Button>
              <Button
                variant="success"
                size="lg"
                fullWidth={false}
                onClick={() => call?.join()}
                className="flex-1"
              >
                <span className="mr-2">📹</span>
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const IncomingCallScreen = () => {
  const calls = useCalls();
  const activeCall = calls[0];
  const { user } = useAuth();

  if (!activeCall || !user) return null;

  return (
    <StreamCall call={activeCall}>
      <CallPanel />
    </StreamCall>
  );
};

export default IncomingCallScreen;
