import { createServer } from 'http';
import { Server } from 'socket.io';
import { JoinRoomDto } from './Dtos/joinRoom.dto';
import { PlayerService } from './player/player.service';
import { RoomService } from './room/room.service';
import { RoomRepository } from './room/room.repository';
import { PlayerRepository } from './player/player.repository';
import { RoomDto } from './Dtos/room.dto';
const express = require('express');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:63342"]
    }
});

const port = 3000;
const socketClient = new Map<string, string>;

const roomRepository = new RoomRepository();
const playerRepository = new PlayerRepository();

const playerService = new PlayerService(playerRepository);
const roomService = new RoomService(roomRepository, playerRepository);

io.on('connection', (socket) => {
    console.log(`connect new socket: ${socket.id}`);

    const player = playerService.create();
    socketClient.set(socket.id, player.id);

    socket.emit('getPlayer', player);
    socket.emit('updateRooms', roomService.getRooms());

    socket.on('joinPlayer', (joinRoomDto: JoinRoomDto) => {
        roomService.leavePlayerWithAllRoom(joinRoomDto.player.id);
        roomService.joinPlayer(joinRoomDto);

        if (roomService.isJoinPlayer(joinRoomDto.room, joinRoomDto.player)) {
            socket.join(joinRoomDto.room.id);

            if (roomService.isRoomFull(joinRoomDto.room.id)) {
                io.to(joinRoomDto.room.id).emit('showTicTacToe');
            }
        }

        io.emit('updateRooms', roomService.getRooms());
    });

    socket.on('disconnect', () => {
        const leavePlayerId = socketClient.get(socket.id);

        if (leavePlayerId) {
            const rooms = roomService.leavePlayerWithAllRoom(leavePlayerId);

            rooms.forEach((room: RoomDto) => socket.leave(room.id));

            io.emit('updateRooms', roomService.getRooms());
        }
    });
});

httpServer.listen(port, () => {
    console.log('Socket server is begin work...');
});