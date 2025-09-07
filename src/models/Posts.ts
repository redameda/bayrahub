import { model, models, Schema } from "mongoose";

const postsc = new Schema({
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, max: 39, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    tags: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true })
const Post = models.Post || model("Post", postsc);
export default Post;