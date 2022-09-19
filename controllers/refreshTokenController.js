const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {this.users = data}
}

const jwt = require('jsonwebtoken');
require('dotenv').config();



const handleRefreshToken = async (req, res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401);
    const foundUser = userDB.users.find(person => person.username === user);
    if(!foundUser) return res.sendStatus(401); //Unauthorized Error from nodejs
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        // Creat JWT
        const accessToken =jwt.sign(
            {"username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken =jwt.sign(
            {"username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        const ohterUsers = userDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken};
        userDB.setUsers([... ohterUsers, currentUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.js'), JSON.stringify(userDB.users))
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        res.json({accessToken})
    } else {
        res.sendStatus(401)
    }
}
module.exports = {handleLogin}