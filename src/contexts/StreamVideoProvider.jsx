// src/contexts/StreamVideoProvider.jsx
import React, { useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { useAuth } from './AuthContext';
import CallProvider from './CallProvider';

const env = import.meta.env.VITE_NODE_ENV;

export function StreamVideoProvider({ children }) {
  const { user, token, loading, streamtoken } = useAuth();
  const [client, setClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    // Don't initialize if auth is still loading or user/token not available
    if (loading || !user || !token) {
      return;
    }

    setClientLoading(true);

    const initializeClient = async () => {
      try {
        const streamUser = {
          id: user.id || user.email || 'anonymous',
          name: user.name || 'Anonymous User',
          image: "https://www.bing.com/images/search?view=detailV2&ccid=Jp%2fuKY8c&id=1FD2BB3EB2BE3F10F7EEEC0677D90BEDAB6513A6&thid=OIP.Jp_uKY8cFy-ji3S-6lEtBQHaHa&mediaurl=https%3a%2f%2fstatic.vecteezy.com%2fsystem%2fresources%2fpreviews%2f021%2f240%2f591%2foriginal%2fnature-icon-design-free-vector.jpg&exph=1920&expw=1920&q=Nature+Icon&FORM=IRPRST&ck=6DAFBB963B12764A4B9AB27231839BFA&selectedIndex=5&itb=0"
        };

        let key = null;
        if (env === "dev") {
          key = import.meta.env.VITE_STREAM_VIDEO_KEY;
        } else {
          const keyResponse = await fetch(`/api/getStreamKey`);
          const keyData = await keyResponse.json();

          if (!keyResponse.ok) {
            throw new Error(keyData.error || "Failed to fetch Stream key");
          }

          key = keyData.key;
        }

        const streamClient = new StreamVideoClient({
          apiKey: key,
          user: streamUser,
          token: streamtoken // Use your existing auth token or get Stream token from backend
        });

        setClient(streamClient);
      } catch (error) {
        console.error('Failed to initialize Stream Video client:', error);
      } finally {
        setClientLoading(false);
      }
    };

    initializeClient();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(null);
      }
    };
  }, [user, token, loading, streamtoken]);

  // Show loading while auth or client is initializing
  if (loading || clientLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user authenticated, render children without video context
  if (!user || !client) {
    return children;
  }

  // Render with Stream Video context only when client is ready
  return (<
    StreamVideo client={client}>
    <CallProvider>
      {children}
    </CallProvider>
  </StreamVideo>
  );
}
