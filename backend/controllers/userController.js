const prisma = require("../config/db");

const registerUser = async(req,res) => {
    try{
        const{email,name,phonenumber,password,role} = req.body;

        if(!email || !name || !phonenumber || !password || !role){
            return res.status(400).json({message : "Fill all fields"});
        }

        const existUser = await prisma.User.findUnique({
            where: {email},
        });

        if(existUser){
            return res.status(400).json({message: "User already exists!!"});
        }

        const newUser = await prisma.User.create({
            data: {
                email,
                name,
                phonenumber,
                password,
                role
            },
        });

        res.status(201).json(newUser);

    }catch (err){
        console.error("Error Registering user: ", err);
        res.status(500).json({message : "Internal server error"})
    }
}

module.exports = {registerUser}








