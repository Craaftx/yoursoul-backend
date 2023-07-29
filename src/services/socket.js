import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const ioService = server => {
  const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_ORIGIN,
    },
  });

  io.on('connection', socket => {
    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);

      socket.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });
    });

    socket.on('player-state', ({ roomId, userId, state }) => {
      socket.to(roomId).emit('player-state', { userId, state });
    });

    socket.on('play-video', ({ roomId, currentTime }) => {
      socket.to(roomId).emit('play-video', { currentTime });
    });

    socket.on('pause-video', ({ roomId }) => {
      socket.to(roomId).emit('pause-video');
    });
  });

  return io;
};

export default ioService;
