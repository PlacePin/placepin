import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { DirectMessageModel } from './database/models/Message.model';
import { LandlordModel } from './database/models/Landlord.model';
import { TenantModel } from './database/models/Tenant.model';

interface DMDataProps {
  senderId: string;
  recipientUsername: string;
  content: string;
}

export function chatSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // Each user joins their personal "room"
    socket.on('join_room', (userId) => {
      socket.join(userId);
    });

    // Handle private messages
    socket.on(
      'private_message',
      async ({
        senderId,
        recipientUsername,
        content,
      }: DMDataProps
      ) => {
        try {
          const time = new Date();
          const receiver =
            await LandlordModel.findOne({ username: recipientUsername }) || await TenantModel.findOne({ username: recipientUsername })

          if (!receiver) {
            return 'User not found!'
          }

          const receiverId = String(receiver._id)

          // Look for an existing conversation between the two
          let conversation = await DirectMessageModel.findOne({
            participants: { $all: [senderId, receiverId] },
          });

          if (!conversation) {
            // Create new conversation if none exists
            conversation = new DirectMessageModel({
              participants: [senderId, receiverId],
              participantsModel: ['Landlords', receiver.accountType], // Adjust this logic later to detect type dynamically
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
            receiverId,
            content,
            sentAt: time,
          };

          // Emit to both recipient and sender
          io.to(receiverId).emit('private_message', message);
          io.to(senderId).emit('private_message', message);

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
