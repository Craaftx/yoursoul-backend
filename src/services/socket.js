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

      socket.to(roomId).emit('user-in-room', { roomId, userId });
      console.log(`${userId} enter in the room`);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-out-room', { roomId, userId });
      });
    });

    socket.on('join-game', ({ roomId, userId }) => {
      socket.join(roomId);

      socket.to(roomId).emit('user-in-game', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-out-game', userId);
      });
    });

    socket.on(
      'player-state',
      ({ roomId, userId, isOwner, username, state, lives, ready }) => {
        console.log(`${userId} (${username}) share is state`);
        socket.to(roomId).emit('player-state', {
          userId,
          isOwner,
          username,
          state,
          lives,
          ready,
        });
      }
    );

    socket.on('room-state', ({ roomId, state, currentTime }) => {
      console.log(`Room share is state (${state}) & time ${currentTime}`);
      socket.to(roomId).emit('room-state', {
        state,
        currentTime,
      });
    });

    socket.on('start-game', ({ roomId }) => {
      socket.to(roomId).emit('start-game');
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
