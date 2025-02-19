import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../Store/isAuthStore';
import { useChatStore } from '../Store/isChatStore';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoCall = () => {
  const { socket, authUser } = useAuthStore();
  const { selectedUser } = useChatStore();
  const { id: roomId } = useParams();
  const [searchParams] = useSearchParams();
  const isCaller = searchParams.get('caller') === 'true';
  const navigate = useNavigate();
  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isWaiting, setIsWaiting] = useState(isCaller);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(null);

  // Initialize WebRTC peer connection
  const initializePeerConnection = async () => {
    console.log('Initializing peer connection...');
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    peerConnection.current = new RTCPeerConnection(configuration);
    console.log('Peer connection created');

    // Add local tracks to peer connection
    if (localStream) {
      console.log('Adding local stream tracks to peer connection');
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });
    }

    // Handle incoming remote stream
    peerConnection.current.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        console.log('Setting remote video stream');
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE candidate:', event.candidate);
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          roomId
        });
      }
    };

    // Connection state changes
    peerConnection.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.current.connectionState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.current.iceConnectionState);
    };

    // If caller, create and send offer
    if (isCaller) {
      try {
        console.log('Creating offer as caller');
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('offer', {
          offer,
          roomId,
          receiverId: selectedUser._id
        });
      } catch (error) {
        console.error('Error creating offer:', error);
        toast.error('Failed to create call offer');
      }
    }
  };

  useEffect(() => {
    console.log('VideoCall component mounted, isCaller:', isCaller);
    // Initialize media stream
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true 
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        await initializePeerConnection();
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Could not access camera/microphone');
        navigate('/');
      }
    };

    initializeMedia();

    // Setup WebRTC signaling listeners
    socket.on('offer', async ({ offer }) => {
      if (!peerConnection.current) return;
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer', {
          answer,
          roomId,
          callerId: selectedUser._id
        });
      } catch (error) {
        console.error('Error handling offer:', error);
        toast.error('Failed to process call offer');
      }
    });

    socket.on('answer', async ({ answer }) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (error) {
        console.error('Error handling answer:', error);
        toast.error('Failed to process call answer');
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    // Call status listeners
    if (isCaller) {
      socket.on('callAccepted', () => {
        setIsWaiting(false);
        toast.success('Call connected!');
      });

      socket.on('callDeclined', ({ receiverName }) => {
        cleanupCall();
        toast.error(`Call declined by ${receiverName}`);
        navigate('/');
      });
    }

    socket.on('callEnded', () => {
      cleanupCall();
      toast.error('Call ended by other user');
      navigate('/', { replace: true });
    });

    socket.on('callCancelled', () => {
      cleanupCall();
      toast.error('Call cancelled');
      navigate('/', { replace: true });
    });

    // Cleanup function
    return () => {
      cleanupCall();
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('callAccepted');
      socket.off('callDeclined');
      socket.off('callEnded');
      socket.off('callCancelled');
    };
  }, []);

  const cleanupCall = () => {
    // Stop all tracks in local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        localStream.removeTrack(track);
      });
      setLocalStream(null);
    }

    // Stop all tracks in remote stream
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop();
        remoteStream.removeTrack(track);
      });
      setRemoteStream(null);
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Close and cleanup peer connection
    if (peerConnection.current) {
      peerConnection.current.ontrack = null;
      peerConnection.current.onicecandidate = null;
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };

  const handleEndCall = () => {
    cleanupCall();
    
    if (isCaller && isWaiting) {
      socket.emit('cancelCall', { 
        receiverId: selectedUser._id,
        roomId: roomId
      });
    } else {
      socket.emit('endCall', { 
        roomId: roomId,
        userId: authUser._id
      });
    }
    
    navigate('/', { replace: true });
  };

  // Update the beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      cleanupCall();
      // Ensure call is ended on server
      socket.emit('endCall', { 
        roomId: roomId,
        userId: authUser._id
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white p-4">
      {isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Waiting for answer...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded">
              You
            </div>
          </div>
          
          {/* Remote Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded">
              Remote User
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pb-4">
          <button
            onClick={handleEndCall}
            className="btn btn-error btn-circle btn-lg"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
