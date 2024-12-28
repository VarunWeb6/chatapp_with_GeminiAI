import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minLength : [6, 'name must be atleast 8 characters long'],
        maxLength : [20, "name can't exceed 15 characters long"]
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

const Project = mongoose.model('project', projectSchema)

export default Project;