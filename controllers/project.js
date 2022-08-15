const mongoose = require("mongoose")
const Project = require("../models/project")

global.getProject = function(){
    return new Promise(resolve => {
        Project.find({}).exec()
        .then(result => {
            resolve(result)
        }).catch(err => {
            resolve(err)
        })
    })
}

global.getProjectByPid = function(pid){
    return new Promise(resolve => {
        Project.find({projectID: pid}).exec()
        .then(result => {
            resolve(result)
        }).catch(err => {
            resolve(err)
        })
    })
}

exports.getProject = async function(req,res){
    var getproject = await getProject()
    res.status(201).send(getproject)
}

exports.getProjectByPid = async function(req,res){
    var pid = req.params.pid
    var getprojectbypid = await getProjectByPid(pid)
    res.send({
        message: "success",
        data: getprojectbypid
    })
}

exports.postCreateProject = async function(req,res){
    var getprojectbypid = await getProjectByPid(req.body.pid)
    if(getprojectbypid.length <= 0){
        const project = new Project({
            _id: new mongoose.Types.ObjectId(),
            projectID: req.body.pid,
            projectName: req.body.prjname,
            projectType: req.body.type,
            status: req.body.status,
            startDate: req.body.startdate,
            endDate: req.body.enddate,
            multiple: req.body.multiple,
        })
        project
            .save()
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
        res.status(201).json({
            message: "success",
            data: project
        })
    }else{
        res.json({
            message: "project exist"
        })
    }
}