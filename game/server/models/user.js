//reqs
var mongoose = require('mongoose'); //read write to database made simpler
var bcrypt = require('bcrypt-nodejs'); //encryption we dont send or store plain text passwords

var userSchema = mongoose.Schema({
    local: {
        //all field are not required by default so validate in passport login/signup logic
        username: String,
        password: String,
        score: Number
    }
});

//generate password hash
userSchema.methods.generateHash = function(password) {
    //12 iterations 2^12 of the key derivation, that's a far as my knowledge on password hashing and so forth goes
    var salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt, null);
};

//is password valid?
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//export the model
module.exports = mongoose.model('User', userSchema);
