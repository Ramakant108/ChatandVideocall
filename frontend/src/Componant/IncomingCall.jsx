import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../Store/isAuthStore';
import toast from 'react-hot-toast';

const IncomingCall = ({ caller, onDecline }) => {
  const navigate = useNavigate();
  const { socket, authUser } = useAuthStore();

  const handleAccept = () => {
    socket.emit('callAccepted', {
      callerId: caller.callerId,
      receiverId: authUser._id,
      roomId: caller.roomId
    });
    onDecline(); // Close the notification
    navigate(`/video/${caller.roomId}?caller=false`);
  };

  const handleDecline = () => {
    socket.emit('callDeclined', {
      callerId: caller.callerId,
      receiverId: authUser._id,
      receiverName: authUser.fullName
    });
    onDecline();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          Incoming Video Call
        </h3>
        <p className="mb-6">
          {caller.callerName} is calling you...
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="btn btn-success btn-circle"
          >
            <Phone size={24} />
          </button>
          <button
            onClick={handleDecline}
            className="btn btn-error btn-circle"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall; 