import Room from "../models/room";
import { IRoom, IRoomFilter, IRoomUpdate } from 'room.types';
import { Schema } from 'mongoose';

export default class RoomService {
    async create(room: IRoom): Promise<IRoom> {
        return RoomService.objectIdToString(await Room.create(room));
    }

    async find(filter: IRoomFilter): Promise<IRoom[]> {
        return Room.find(filter);
    }

    async findById(roomId: string): Promise<IRoom | null> {
        return Room.findById(roomId);
    }

    async update(roomId: string, roomData: IRoomUpdate): Promise<IRoom | null> {
        await Room.updateOne({ _id: roomId }, roomData);
        return Room.findById(roomId);
    }

    async delete(roomId: string) {
        return Room.findOneAndDelete({ _id: roomId });
    }

    private static objectIdToString(obj: any) {
        for (const objKey in obj) {
            if (obj[objKey] instanceof Schema.Types.ObjectId) {
                obj[objKey] = obj[objKey].toString();
            }
        }
        return obj;
    }
}
