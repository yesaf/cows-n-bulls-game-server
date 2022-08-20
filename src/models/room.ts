import { Schema, model } from 'mongoose';
import User from './user';

const RoomSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String},
    open: {type: Boolean, default: true},
    creatorId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User', required: true}],
});

export default model('Room', RoomSchema);
