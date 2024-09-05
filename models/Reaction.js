const { Schema, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReactionSchema = new Schema( {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: 'Please enter a reaction!',
        maxLength: 280
    },
    username: {
        type: String,
        // you can write true or false after required to specify if it is required or not
        required: 'Please enter your username!'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get:  timestamp => dateFormat(timestamp)
    }
},
{
    toJSON: {
        getters: true
    },
    id: false
}
);


module.exports = ReactionSchema;