import { Server } from 'socket.io';

export function chatSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Each user joins their personal "room"
    socket.on('join_room', (userId) => {
      socket.join(userId);
      console.log(`${userId} joined their room`);
    });

    // Private 1-on-1 messaging
    socket.on('private_message', ({ senderId, recipientId, text }) => {
      const message = { senderId, recipientId, text, time: new Date().toISOString() };

      console.log('Private message:', message);

      // Send only to recipient
      io.to(recipientId).emit('private_message', message);
      // io.to(senderId).emit('private_message', message);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}
