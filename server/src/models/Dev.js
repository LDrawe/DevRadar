import { Schema, model } from "mongoose";
import PointSchema from "../utils/PointSchema";

const DevSchema = new Schema({
	github_username: String,
	techs: [String],
	location: {
		type: PointSchema,
		index: '2dsphere'
	}
});

export default model('Dev', DevSchema);