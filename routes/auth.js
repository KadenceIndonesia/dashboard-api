const express = require("express")
const Router = express()
const User = require("../models/user")
const Joi = require("@hapi/joi")
const mongoose  = require("mongoose")
const Cryptr = require("cryptr")
const enc = new Cryptr("kadence")

// const schema = {
//     projectID: Joi.string().required(),
//     username: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//     status: Joi.number()
// }

global.getUserByEmail = function (email) {
    return new Promise(resolve => {
        User.find({email: email}).exec().then(result => {
            resolve(result)
        })
    })
}
global.getProjectInUsers = function(email, pid){
    return new Promise(resolve => {
        User.find({email: email, projectID: {$in: pid}}).exec().then(result => {
            resolve(result)
        })
    })
}

Router.post('/register', async function (req,res,next) {
    var emailBody = req.body.email;
    var pid = req.body.pid;
    const encryptPass = enc.encrypt(req.body.password);

    var getUser = await getUserByEmail(emailBody);
    if(getUser.length == 0){
        const createUser = new User({
            _id: new mongoose.Types.ObjectId(),
            projectID: req.body.pid,
            username: req.body.username,
            email: req.body.email,
            password: encryptPass,
            status: req.body.status
        })
        createUser
            .save()
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
        res.status(201).send({
            message: "success",
            createdUser: createUser
        })
    }else{
        var assigned = getUser[0].projectID.indexOf(pid) 
        //check if email already assign to project
        if(assigned!=-1){
            res.json({
                message: "Assigned"
            })
            
        }else{
            // push new projectID
            var updateProjectID = getUser[0].projectID
            updateProjectID.push(pid)
            User.updateOne({email: emailBody}, {$set: {projectID: updateProjectID}}).exec().then(result => {
                res.json({
                    message: "update pid"
                })
            })
        }
    }
    
})
Router.post('/login', async function(req,res){
    var email = req.body.email
    var pass = req.body.password
    var pid = req.body.pid
    var getUser = await getUserByEmail(email);
    var getprojectinusers = await getProjectInUsers(email, pid);
    var decrypt = enc.decrypt(getUser[0].password)
    if(pass==decrypt){
        if(getprojectinusers.length > 0){
            res.status(200).json({
                message: "success",
                login: [
                    {
                        "pid": pid,
                        "email": email,
                        "username": getUser[0].username
                    }
                ]
            })
        }else{
            res.json({
                message: "not assigned"
            })
        }
    }else{
        res.json({
            message: "invalid password"
        })
    }
})


module.exports = Router;