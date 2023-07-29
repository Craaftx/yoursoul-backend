const $videoGrid = document.getElementById('video-grid');

const ROOM_ID = '6218cbb2-8ea7-11ed-a1eb-0242ac120002';

function bindVideoStream($video, stream) {
  $video.srcObject = stream;
  $video.addEventListener('loadedmetadata', () => {
    $video.play();
  });
  $videoGrid.append($video);
}

(async () => {
  let stream = undefined;

  const socket = window.io();

  const peer = new Peer();

  const $video = document.createElement('video');
  $video.muted = true;

  const peers = {};

  function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const $video = document.createElement('video');
    $video.id = userId;
    call.on('stream', userVideoStream => {
      bindVideoStream($video, userVideoStream);
    });

    call.on('close', () => {
      $video.remove();
    });

    peers[userId] = call;
  }

  peer.on('open', async id => {
    stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    bindVideoStream($video, stream);

    socket.emit('join-room', ROOM_ID, id);
  });

  peer.on('call', call => {
    call.answer(stream);
    const $video = document.createElement('video');
    $video.id = call.peer;
    call.on('stream', userVideoStream => {
      bindVideoStream($video, userVideoStream);
    });
  });

  socket.on('user-connected', userId => {
    console.log('user is connected');
    connectToNewUser(userId, stream);
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) {
      const peer = peers[userId].peer;

      document.getElementById(userId)?.remove();
      document.getElementById(peer)?.remove();

      peers[userId].close();
    }
  });
})();
