const prisma = require("../config/db");
const { generateInviteToken, hashToken} = require("../utils/tokenUtils");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");

const createInvite = async (req, res) => {
    try{
        const { email, role} = req.body;
        const { boardId } = req.params;

        if(!email){
            return res.status(400).json({ message : "Email required"});
        }

        const rawToken = generateInviteToken();
        const tokenHash = await hashToken(rawToken);

        const invite = await prisma.Invite.create({
            data : {
                boardId : parseInt(boardId),
                email,
                role : role || "Viewer",
                tokenHash,
                expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            },
        });

        const link = `http://localhost:5173/accept-invite?token=${rawToken}`    // to be modified when frontend will be made

        await sendEmail(
            {to : email,
            subject : "You've been invited to join a board !! !!",
           text : `Click below to accept your invite:
            ${link}
            This link expires in 7 days.
            `});

            res.status(201).json({ message : "Invite created & email sent", inviteId : invite.id});

    }catch(err){
        console.error("Error creating invite: ", err);
        res.status(500).json({ message : "Server error"});
    }
};

const acceptInvite = async (req, res) => {
    try{

        const { token } = req.body;
        const userId = req.user.id;

        if(!token){
            return res.status(400).json({ message : "Invite token required"});
        }

        const invites = await prisma.Invite.findMany({
            where : {
                used : false,
                expiresAt : { gt : new Date()},
            },
        });

        let invite = null;

        for(const inv of invites){
            const match = await bcrypt.compare(token, inv.tokenHash);
            if(match){
                invite = inv;
                break;
            }
        }

        if(!invite){
            return res.status(400).json({ message : "Invalid or expired invite"});
        }

        const existing = await prisma.BoardMember.findUnique({
            where : { boardId_userId : { boardId : invite.boardId, userId}},
        });

        if(existing){
            return res.status(400).json({ message : "You are already a member of this board"});
        }

        await prisma.BoardMember.create({
            data : {
                boardId : invite.boardId,
                userId,
                role : invite.role,
            },
        });

        await prisma.invite.update({
            where : { id : invite.id},
            data : { used : true},
        });

        res.json({ message : "Invite accepted successfully", boardId : invite.boardId});

    }catch(err){
        console.error("Error accepting invite: ", err);
        res.status(500).json({ message : "Server error"});
    }
};

const validateInvite = async (req, res) => {
    try{

        const token = req.query.token;

        if(!token){
            return res.status(400).json({ valid : false, reason : "Invite Token required"});
        }

        const invites = await prisma.Invite.findMany({
            where: {
                used : false,
                expiresAt : { gt : new Date()},
            },
            include : { board : true},
        });

        let invite = null;

        for ( const inv of invites){
            const match = await bcrypt.compare(token, inv.tokenHash);

            if(match) { 
                invite = inv;
                break;
            }
        }

        if (!invite){
            return res.status(400).json({ valid : false, reason : "Invalid or expired invite"});
        }

        res.json({
            valid : true,
            boardId : invite.boardId,
            boardTitle : invite.board.title,
            email : invite.email,
            role : invite.role,
            expiresAt : invite.existingAt,
        });

    }catch(err){
        console.error("Error validating invite: ", err);
        res.status(500).json( {valid : false, reason : "Server error"});
    }
};

module.exports = { createInvite, acceptInvite, validateInvite};