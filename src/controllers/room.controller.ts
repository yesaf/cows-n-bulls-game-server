import RoomService from '../services/room.service';
import { NextFunction, Request, Response } from 'express';
import { IRoom, IRoomCreate, IRoomFilter } from 'room.types';
import bcrypt from 'bcryptjs';
import ApiError from '../exceptions/api.error';

class RoomController {
    constructor(
        private roomService: RoomService
    ) {}

    async create(req: Request<any, any, IRoomCreate>, _res: Response, next: NextFunction) {
        try {
            const { name, password, open } = req.body;
            let roomData: IRoom = {
                name,
                creatorId: req.user.id,
                users: [req.user.id]
            };
            if (password) {
                roomData.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            }
            if (open) {
                roomData.open = open;
            }

            return await this.roomService.create(roomData);
        } catch (e) {
            next(e)
        }
    }

    async connect(req: Request<any, any, { _id: string, password?: string } >, _res: Response, next: NextFunction) {
        try {
            const { _id, password } = req.body;
            const room = await this.roomService.findById(_id);
            return await this.connectRoom(req.user.id, _id, password, room)
        } catch (e) {
            next(e)
        }
    }

    async disconnect(req: Request<any, any, { _id: string } >, _res: Response, next: NextFunction) {
        try {
            const { _id } = req.body;
            const room = await this.roomService.findById(_id);
            return await this.disconnectRoom(req.user.id, _id, room);
        } catch (e) {
            next(e)
        }
    }

    async find(req: Request<any, any, any, IRoomFilter>, _res: Response, next: NextFunction) {
        try {
            const filter = req.query;
            if (typeof filter.name === 'string') {
                filter.name = { "$regex": filter.name, "$options": "i" };
            }
            return await this.roomService.find(req.query);
        } catch (e) {
            next(e)
        }
    }

    async delete(req: Request<any, any, {_id: string}>, _res: Response, next: NextFunction) {
        try {
            const { _id } = req.body;
            return await this.roomService.delete(_id);
        } catch (e) {
            next(e)
        }
    }

    private async connectRoom(userId: string, roomId: string,
        password: string | undefined, room: IRoom | null) {
        if (room) {
            if (room.users.includes(userId)) {
                return {
                    connected: true,
                    room: room
                }
            }
            if (!room.open) {
                throw ApiError.ForbiddenError("Lobby is already full");
            }
            if (room.password) {
                if (!password) {
                    throw ApiError.ForbiddenError("Lobby requires password to enter");
                }
                const isValid = bcrypt.compare(password, room.password);
                if (!isValid) {
                    throw ApiError.ForbiddenError("Wrong password");
                }
                const updatedRoom = await this.roomService.update(
                    roomId, { users: [...room.users, userId], open: false }
                );
                return {
                    connected: true,
                    room: updatedRoom
                }
            } else {
                const updatedRoom = await this.roomService.update(
                    roomId, { users: [...room.users, userId], open: false }
                );
                return {
                    connected: true,
                    room: updatedRoom
                }
            }
        } else {
            throw new ApiError(404, "No room with such id");
        }
    }

    private async disconnectRoom(userId: string, roomId: string, room: IRoom | null) {
        if (room) {
            if (room.users.includes(userId)) {
                const updatedRoom = await this.roomService.update(roomId, {
                    users: room.users.filter(userId => userId !== userId),
                })
                if (!updatedRoom) {
                    throw new ApiError(404, "Room was deleted");
                }
                else if (updatedRoom.users.length === 0) {
                    await this.roomService.delete(roomId);
                    return {
                        deleted: true,
                        room: updatedRoom,
                    }
                }
                return {
                    deleted: false,
                    room: updatedRoom,
                }
            }
        } else {
            throw new ApiError(404, "No room with such id");
        }
    }
}

export default new RoomController(new RoomService())
