const { Schema, model } = require('mongoose');

const UserSchema = new Schema({ 
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+|\..+/, 'Please enter a valid e-mail!']
    },
    thoughts: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Thought'  
        }
    ],
},
{
    toJSON: {
        virtuals: true
    },
    id: false
}
);

UserSchema.virtuals('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema); 

module.exports = User;