import { Server as HttpServer } from 'http';
import { Server as IoServer, Socket } from 'socket.io';
import RoomService from '../services/room.service';

interface ISessionData {
    userId?: string;
    roomId?: string;
}

export default (server: HttpServer) => {
    const roomService = new RoomService();
    const sessionData: ISessionData = {

    };
    const io = new IoServer(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.0.157:3000']
        }
    });

    io.on('connection',  (socket: Socket) => {
        console.log('connection', socket.id);
        socket.on('joinRoom', async ({roomId, userId}) => {
            if ((await roomService.findById(roomId))?.users.includes(userId)) {
                sessionData.userId = userId;
                sessionData.roomId = roomId;
                console.log(`User with id ${userId} connects to the room ${roomId}`);
                console.log('Session data:');
                console.log(sessionData);
                socket.emit('connected', sessionData)
            } else {
                socket.emit('notPlayer');
            }
        })
        // socket.on('joinRoom', ({ roomID }) => {
        //     sessionStore.saveSession(socket.sessionID, {
        //         sessionID: socket.sessionID,
        //         userID: socket.userID,
        //         roomID: socket.roomID,
        //         username: socket.username
        //     });
        //
        //     socket.emit('session', {
        //         sessionID: socket.sessionID,
        //         userID: socket.userID
        //     });
        //
        //     const user = newUser({ ...socket, roomID, isReady: false });
        //     socket.join(user.roomID);
        //
        //     socket.emit('users', getUsers(roomID).filter((user) => user.roomID === roomID));
        //     socket
        //         .broadcast
        //         .to(user.roomID)
        //         .emit('user connected', {
        //             userID: socket.userID,
        //             username: socket.username,
        //             roomID: socket.roomID,
        //             isReady: user.isReady
        //         });
        });

    //     socket.on('isReady', ({ userID, isReady }) => {
    //         const userUpdated = updateUser(userID, isReady);
    //
    //         socket.broadcast
    //             .to(userUpdated.roomID)
    //             .emit('isReadyUser', userUpdated);
    //     });
    //
    //     socket.on('startGame', async ({ users, roomID }) => {
    //         game = new Game(roomID, ...users);
    //         await game.start();
    //
    //         game.fullLog();
    //
    //         io.to(roomID).emit('startGame', { game });
    //     });
    //
    //     socket.on('placeCard', ({ cardID }) => {
    //         const isPlaceCard = game.placeCard(cardID);
    //
    //         if (isPlaceCard) {
    //             io.to(game.id).emit('placeCard', { game });
    //         }
    //     });
    //
    //     socket.on('endTurn', ({ userID }) => {
    //         game.endTurn(userID);
    //
    //         io.to(game.id).emit('endTurn', { game });
    //     });
    //
    //     socket.on('disconnect', () => {
    //         console.log('disconnect!');
    //     });
    // });
};
