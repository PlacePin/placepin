import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { DirectMessageModel } from './database/models/Message.model';

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
    // Handle private messages
    socket.on(
      'private_message',
      async ({
        senderId,
        recipientId,
        content,
      }: {
        senderId: string;
        recipientId: string;
        content: string;
      }) => {
        try {
          const time = new Date();

          // Look for an existing conversation between the two
          let conversation = await DirectMessageModel.findOne({
            participants: { $all: [senderId, recipientId] },
          });

          if (!conversation) {
            // Create new conversation if none exists
            conversation = new DirectMessageModel({
              participants: [senderId, recipientId],
              participantsModel: ['Landlords', 'Tenants'], // ⚠️ Adjust this logic later to detect type dynamically
              messages: [],
            });
          }

          // Add new message to the conversation
          conversation.messages.push({
            sender: new mongoose.Types.ObjectId(senderId),
            content,
            sentAt: time,
          });

          conversation.lastUpdated = time;
          await conversation.save();

          // Prepare the message for client emit
          const message = {
            senderId,
            recipientId,
            content,
            time: time.toISOString(),
          };

          // Emit to both recipient and sender
          io.to(recipientId).emit('private_message', message);
          io.to(senderId).emit('private_message', message);

          console.log('Message saved & emitted:', message);
        } catch (err) {
          console.error('Error saving message:', err);
        }
      }
    );

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}
