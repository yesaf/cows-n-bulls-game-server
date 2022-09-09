import { Server as HttpServer } from 'http';
import { Server as IoServer, Socket } from 'socket.io';

export default (server: HttpServer) => {
    const io = new IoServer(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://192.168.0.157:3000', 'https://web.postman.co/']
        }
    });

    // io.use(async (socket: WebSocket, next: NextFunction) => {
    //     const sessionID = socket.handshake.auth.sessionID;
    //     const roomID = socket.handshake.auth.roomID;
    //     if (sessionID) {
    //         const session = sessionStore.findSession(sessionID);
    //
    //         if (session) {
    //             socket.sessionID = sessionID;
    //             socket.roomID = session.roomID;
    //             socket.userID = session.userID;
    //             socket.username = session.username;
    //             return next();
    //         }
    //     }
    //     const username = socket.handshake.auth.username;
    //     if (!username) {
    //         return next(new Error('invalid username'));
    //     }
    //
    //     socket.sessionID = uuidv4();
    //     socket.roomID = roomID;
    //     socket.userID = uuidv4();
    //     socket.username = username;
    //     next();
    // });

    io.on('connection', (socket: Socket) => {
        console.log('connection', socket.id);
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
