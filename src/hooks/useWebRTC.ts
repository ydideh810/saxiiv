import { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';

interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  isCalling: boolean;
}

export function useWebRTC(userId: string) {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    isConnected: false,
    isCalling: false,
  });

  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Initialize PeerJS
    if (!peerRef.current && userId) {
      peerRef.current = new Peer(userId, {
        host: '/',
        port: 443,
        secure: true,
      });

      peerRef.current.on('call', handleIncomingCall);
    }

    return () => {
      peerRef.current?.destroy();
      connectionRef.current?.close();
      state.localStream?.getTracks().forEach(track => track.stop());
    };
  }, [userId]);

  const handleIncomingCall = async (call: any) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setState(prev => ({ ...prev, localStream: stream }));
      call.answer(stream);

      call.on('stream', (remoteStream: MediaStream) => {
        setState(prev => ({
          ...prev,
          remoteStream,
          isConnected: true,
        }));
      });
    } catch (error) {
      console.error('Failed to answer call:', error);
    }
  };

  const startCall = async (recipientId: string, video: boolean = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true,
      });

      setState(prev => ({ ...prev, localStream: stream, isCalling: true }));

      if (peerRef.current) {
        const call = peerRef.current.call(recipientId, stream);

        call.on('stream', (remoteStream: MediaStream) => {
          setState(prev => ({
            ...prev,
            remoteStream,
            isConnected: true,
            isCalling: false,
          }));
        });
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      setState(prev => ({ ...prev, isCalling: false }));
    }
  };

  const endCall = () => {
    connectionRef.current?.close();
    state.localStream?.getTracks().forEach(track => track.stop());
    setState({
      localStream: null,
      remoteStream: null,
      isConnected: false,
      isCalling: false,
    });
  };

  const toggleVideo = () => {
    if (!state.localStream) return;

    const videoTrack = state.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setState(prev => ({ ...prev }));
    }
  };

  const toggleAudio = () => {
    if (!state.localStream) return;

    const audioTrack = state.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setState(prev => ({ ...prev }));
    }
  };

  return {
    ...state,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
  };
}