import express from "express";
import http from "http"
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"]  // Add allowed methods
    }
});

export const getsocketIdOfReciever = (receiverId) => {
    return onlineuser[receiverId];
}

const onlineuser = {};
const activeRooms = new Map(); // Track active video calls

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineuser[userId] = socket.id;
        console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
        console.log('Current online users:', onlineuser);
    }
    
    io.emit('getOnlineUser', Object.keys(onlineuser));

    // Video call signaling
    socket.on('initiateCall', ({ callerId, receiverId, callerName, roomId }) => {
        console.log(`Call initiated by ${callerName} (${callerId}) to ${receiverId}`);
        const receiverSocketId = onlineuser[receiverId];
        
        if (receiverSocketId) {
            console.log(`Receiver ${receiverId} is online with socket: ${receiverSocketId}`);
            if (activeRooms.has(receiverId)) {
                console.log(`Receiver ${receiverId} is busy in another call`);
                io.to(socket.id).emit('callError', { message: 'User is busy in another call' });
                return;
            }

            activeRooms.set(callerId, roomId);
            activeRooms.set(receiverId, roomId);
            console.log(`Room ${roomId} created for call`);

            io.to(receiverSocketId).emit('incomingCall', {
                callerId,
                callerName,
                roomId
            });
        } else {
            console.log(`Receiver ${receiverId} is offline`);
            io.to(socket.id).emit('callError', { message: 'User is offline' });
        }
    });

    socket.on('callAccepted', ({ callerId, receiverId, roomId }) => {
        console.log(`Call accepted by ${receiverId} for room ${roomId}`);
        const callerSocketId = onlineuser[callerId];
        if (callerSocketId) {
            console.log(`Notifying caller ${callerId} of acceptance`);
            socket.join(roomId);
            io.to(callerSocketId).emit('callAccepted', { roomId, receiverId });
        }
    });

    socket.on('callDeclined', ({ callerId, receiverId, receiverName }) => {
        const callerSocketId = onlineuser[callerId];
        if (callerSocketId) {
            // Clean up room data
            activeRooms.delete(callerId);
            activeRooms.delete(receiverId);
            
            io.to(callerSocketId).emit('callDeclined', { receiverName });
        }
    });

    // WebRTC signaling with debug logs
    socket.on('offer', ({ offer, roomId, receiverId }) => {
        console.log(`Offer received for room ${roomId} to receiver ${receiverId}`);
        const receiverSocketId = onlineuser[receiverId];
        if (receiverSocketId) {
            console.log(`Sending offer to receiver socket: ${receiverSocketId}`);
            io.to(receiverSocketId).emit('offer', { offer, roomId });
        }
    });

    socket.on('answer', ({ answer, roomId, callerId }) => {
        console.log(`Answer received for room ${roomId} from caller ${callerId}`);
        const callerSocketId = onlineuser[callerId];
        if (callerSocketId) {
            console.log(`Sending answer to caller socket: ${callerSocketId}`);
            io.to(callerSocketId).emit('answer', { answer, roomId });
        }
    });

    socket.on('ice-candidate', ({ candidate, roomId }) => {
        console.log(`ICE candidate received for room ${roomId}`);
        socket.to(roomId).emit('ice-candidate', { candidate });
    });

    socket.on('endCall', ({ roomId, userId }) => {
        // Notify everyone in the room that the call has ended
        io.to(roomId).emit('callEnded');
        
        // Clean up room data
        if (activeRooms.has(userId)) {
            activeRooms.delete(userId);
        }
        
        // Leave the room
        socket.leave(roomId);
    });

    socket.on('cancelCall', ({ receiverId, roomId }) => {
        const receiverSocketId = onlineuser[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('callCancelled');
        }
        
        // Clean up room data
        if (activeRooms.has(userId)) {
            activeRooms.delete(userId);
        }
        
        // Leave the room
        socket.leave(roomId);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        if (userId) {
            const roomId = activeRooms.get(userId);
            if (roomId) {
                console.log(`User ${userId} was in room ${roomId}, cleaning up`);
                io.to(roomId).emit('callEnded');
                activeRooms.delete(userId);
            }
            delete onlineuser[userId];
            io.emit('getOnlineUser', Object.keys(onlineuser));
        }
    });
});

export { app, io, server };