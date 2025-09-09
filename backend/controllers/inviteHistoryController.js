const prisma = require("../config/db");

const getInviteHistory = async (req, res) => {
    try{

        const boardId = parseInt(req.params.boardId);

        if(!boardId){
            return res.status(400).json({ message : "Board ID required"});
        }

        const logs = await prisma.inviteLog.findMany({
            where : { boardId : parseInt(boardId) },
            orderBy : { createdAt: "desc"},
            select : {
                id : true,
                action : true,
                createdAt : true,

                inviter : {
                    select:{
                        id : true,
                        name : true,
                        email : true,
                    },
                },

                acceptedBy : {
                    select : {
                        id : true,
                        name : true,
                        email : true,
                    },
                },

                board : {
                    select : {
                        id : true,
                        title : true,
                    },
                },
            },
        });

        res.json({ success : true, data : logs});
    }catch(err){
        console.error("Error fetching invite history: ", err);
        res.status(500).json({ message : "Server error"});
    }
};

module.exports = { getInviteHistory };