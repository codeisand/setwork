const cloudinary = require('cloudinary');
const httpStatus = require('http-status-codes');

const User = require('../models/userModels');


cloudinary.config({
    cloud_name:'codeisand',
    api_key: '455284225575459',
    api_secret: 'jbnLLI5qi3F9o66BRBcWry-2zXo'
})

module.exports = {

    async setDefaultImage(req,res){
        const {imgId, imgVersion} = req.params;

        await User.update({
            _id: req.user._id
        }, {
            picId: imgId,
            picVersion: imgVersion
        }).then( () => {
         res.status(httpStatus.OK).json({message: 'Default img sucessfully.'});
        }).catch( err => {
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Default images Unsucessfully.'});
        })
    },


    AddImage(req,res){
       cloudinary.uploader.upload(req.body.image, async (result) => {
           

           await User.update({
               _id: req.user._id
           }, {
               $push: {
                images: {
                    imgId: result.public_id,
                    imgVersion: result.version
                }
               }
           }).then( () => {
            res.status(httpStatus.OK).json({message: 'images uploaded sucessfully.'});
           }).catch( err => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'images uploaded Unsucessfully.'});
           })
       })
    }
}