import { model, models, Schema } from "mongoose";

const commentsc = new Schema({
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
        type: String,
        max: 500
    }

}, { timestamps: true })

const Comment = models.Comment || model("Comment", commentsc)

export default Comment;
