const prisma = require("../config/db")

const checkBoardMember = async (req, res, next) =>{
    try{
        const userId = req.user.id;

        const boardId = parseInt(req.params.boardId || req.body.boardId);

        if(!boardId){
            return res.status(400).json({ message : "Board ID required"});
        }

        const membership = await prisma.BoardMember.findUnique({
            where:{
                boardId_userId: {
                    boardId,
                    userId
                },
            },

            include: {
                board: true
            }
        });

        if(!membership){
            return res.status(403).json({ message : "Access denied: not a board member"})
        }

        req.boardMember = membership;
        req.board = membership.board;

        next();

    }catch(err){
        console.error("checkBoardMembership error: ", err);
        res.status(500).json({ message: "Server error"});
    }
};

const authorizeBoardRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.boardMember){
            return res.status(500).json({ message : "Board membership not checked"});
        }

        if( !allowedRoles.includes(req.boardMember.role)){
             return res.status(403).json({ message : "Access denied: insufficient role"});
        }

        next();
    };
};

const isBoardOwner = (req) => {
    if(!req.boardMember){
        throw new Error("Board membership not checked yet");
    }
    return req.boardMember.role === "Owner";
}

module.exports = {checkBoardMember, authorizeBoardRoles, isBoardOwner};