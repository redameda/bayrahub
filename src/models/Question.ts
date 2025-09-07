import { model, models, Schema } from "mongoose";


const questionsc = new Schema({
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true })


const Question = models.Question || model("Question", questionsc)
export default Question;
