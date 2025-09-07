import { model, models, Schema } from "mongoose";


const usersc = new Schema({
    name: { type: String, req: true },
    email: { type: String, req: true },
    profile: { type: String, req: true },
    bio: { type: String, max: 30, },
    crew: [{ type: Schema.Types.ObjectId, ref: Schema.Types.ObjectId }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    resources: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
})
const User = models.User || model("User", usersc)
export default User;