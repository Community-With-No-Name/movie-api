import mongoose from 'mongoose';
import { UserSchema } from '../schemas/user.schema';

const UsersSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    password: String,
    modified: Date,
    created:Date,
})
const Users = mongoose.model('Users', UsersSchema);
export default Users;
