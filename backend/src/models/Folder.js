import mongoose from 'mongoose';


const folderSchema = new mongoose.Schema(
{
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
name: { type: String, required: true }
},
{ timestamps: true }
);


export default mongoose.model('Folder', folderSchema);