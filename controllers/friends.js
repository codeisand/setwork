const httpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
    followUser(req,res){
    const FollowUser = async () => {
        console.log(req.user._id)
        await User.update({
            _id: req.user._id,
            'following.userFollowed': {$ne: req.body.userFollowed}
        },{
            $push: {
                following: {
                    userFollowed: req.body.userFollowed
                }
            }
        });

        await User.update({
            _id: req.body.userFollowed,
            'following.follower': {$ne: req.user._id}
        },{
            $push: {
                followers: {
                    follower: req.user._id
                },
                notifications: {
                    senderId: req.user._id,
                    message: `${req.user.username } is now following you.`,
                    created: new Date(),
                    viewProfile: false
                }
            }
        });
    };

    FollowUser().then(() => {
        res.status(httpStatus.OK).json({message: 'Follwowing user now'});
    }).catch( err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured yoo'});
    });
    
},

unfollowUser(req,res){
    const unFollowUser = async () => {
        console.log(req.user._id)
        await User.update({
            _id: req.user._id
        },{
            $pull: {
                following: {
                    userFollowed: req.body.userFollowed
                }
            }
        });

        await User.update({
            _id: req.body.userFollowed
        },{
            $pull: {
                followers: {
                    follower: req.user._id
                }
            }
        });
    };

    unFollowUser().then(() => {
        res.status(httpStatus.OK).json({message: 'Unfollwowing user now'});
    }).catch( err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
    });
    
},

    async MarkNoti(req,res){
    if(!req.body.deletevalue){
        await User.updateOne({
            _id: req.user._id,
            'notifications._id': req.params.id
        },{
            $set: {'notifications.$.read': true}
        }
        ).then(() => {
            res.status(httpStatus.OK).json({message: 'Marked as read.'});
        }).catch(()=> {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});  
        });
    } else{
        await User.update({
            _id: req.user._id,
            'notifications._id': req.params.id
        },{
            $pull: {
                notifications: {_id: req.params.id }
            }
        }).then(() => {
            res.status(httpStatus.OK).json({message: 'Deleteed Successfully.'});
        }).catch(()=> {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});  
        });

    }
},
    
    async MarkNotiAll(req,res){
        await User.update({
            _id: req.user._id
        },{
         $set: {'notifications.$[elem].read': true}},
         {arrayFilters: [{'elem.read': false}], multi: true}
         ).then(() => {
            res.status(httpStatus.OK).json({message: 'Marked all Successfully.'});
        }).catch(()=> {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});      
    });

    }


};