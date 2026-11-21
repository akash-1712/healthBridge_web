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

const CallPanel = () => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  
  const isCallCreatedByMe = call?.isCreatedByMe || false;

  // Only show incoming call UI when call is ringing and not created by current user
  if (callingState === CallingState.RINGING && !isCallCreatedByMe) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
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
              onClick={() => {
                call?.leave({ reject: true });
              }}
            >
              Decline
            </button>
            <button 
              className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-semibold"
              onClick={() => {
                call?.join();
              }}
            >
              Accept
            </button>
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
