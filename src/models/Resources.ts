import { model, models, Schema } from "mongoose";

const resourceSc = new Schema({
    publisher: { type: Schema.ObjectId },
    name: { type: String, required: true },
    description: { type: String, required: true },
    downloads: [{ type: Schema.Types.ObjectId, ref: "User" }],
    fileUrl: { type: String }
}, {
    timestamps: true
})

const Resource = models.Resource || model("Resource", resourceSc)
export default Resource;