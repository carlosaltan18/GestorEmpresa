import { Schema, model} from "mongoose"

const companySchema = Schema({
    nameCompany: {
        type: String,
        required: true
    },
    experienceYears: {
        type: String,
        required: true
    },
    levelImpact: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        uppercase: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    }
},
{
    versionKey: false
})

export default model('company', companySchema)