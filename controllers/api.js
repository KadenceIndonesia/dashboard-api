const mongoose  = require("mongoose")
const Project = require("../models/project")
const Attribute = require("../models/attributes")
const fs = require("fs")
const path = require("path")
const xslx = require("xlsx")
const attributes = require("../models/attributes")


global.excelData = function(pid){
    return new Promise(resolve =>{
        var directoryPath = path.join(__dirname, '../public/rawdata/'+pid)
        fs.readdir(directoryPath, function(err,files){
            var dataxls = []
            for(var f=0;f<files.length;f++){
                var workbook  = xslx.readFile("public/rawdata/"+pid+"/"+files[f]);
                var sheetname_list = workbook.SheetNames;
                sheetname_list.forEach(async function(y){
                    var worksheet = workbook.Sheets[y];
                    var headers = {};
                    var data = [];
                    for(z in worksheet){
                        if(z[0] === '|')continue;
                        var tt = 0;
                        for (let i = 0; i < z.length; i++) {
                            if(!isNaN(z[i])){
                                tt = i;
                                break;
                            }
                        };
                        var col = z.substring(0,tt)
                        var row = parseInt(z.substring(tt));
                        var value = worksheet[z].v;
                        if(row == 1 && value) {
                            headers[col] = value;
                            continue;
                        }
                        if(!data[row]) data[row]={};
                        data[row][headers[col]] = value;
                    }
                    data.shift();
                    data.shift();
                    for (var d = 0; d < data.length; d++) {
                        dataxls.push(data[d])   
                    }
                })
            }
            resolve(dataxls)
        })
    })
}

global.getAttributesByPid = function(pid,qidx){
    return new Promise(resolve => {
        Attribute.find({projectID: pid, questionID: qidx}).exec()
        .then(result => {
            resolve(result)
        })
    })
    
}


exports.getApi = async function(req,res){
    Project.find().exec().then(docs => {
        res.status(200).json(docs)
    }).catch(err =>{
        console.log("err")
        res.status(500, {
            error: err
        })
    })
}

exports.postApi = async function(req,res){
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        projectID: req.body.pid,
        projectName: req.body.prjname,
        status: req.body.status,
        startDate: req.body.startdate,
        endDate: req.body.enddate,
    })
    project
        .save()
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err))
    res.status(201).json({
        message: "success",
        createdProject: project
    })
}

exports.getApiProject = async function(req,res){
    const pid = req.params.pid
    Project.find({projectID: pid}).exec()
    .then(docs => {
        res.status(200).json(docs)
    }).catch(err => {
        res.status(500, {
            error: err
        })
    })
}

exports.getApiData = async function(req,res){
    var qidx = req.params.qidx
    var pid = req.params.pid
    var data = await excelData(pid)
    var getattributebypid = await getAttributesByPid(pid, qidx)
    var rawdata = []
    if(getattributebypid[0].type == "SA"){
        console.log("SA")
    }else if(getattributebypid[0].type == "MA"){
        var labelMA = [getattributebypid[0].attribute]
        for (let i = 0; i < data.length; i++) {
            for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
                if(data[i][qidx+"_O"+y]!=-1 && data[i][qidx+"_O"+y] < getattributebypid[0].attribute.length){
                    rawdata.push({
                        sbjnum: data[i]["SbjNum"],
                        label: getattributebypid[0].attribute[data[i][qidx+"_O"+y]].label,
                        kota: data[i]["Kota"],
                        y: 1
                    })
                }
            }
        }
    }else if(getattributebypid[0].type == "LOOPSA"){
        var labelMA = [getattributebypid[0].attribute]
        for (let i = 0; i < data.length; i++) {
            for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
                if(data[i][getattributebypid[0].loopLabel+"_"+qidx]!=-1)
                rawdata.push({
                    sbjnum: data[i]["SbjNum"],
                    label: getattributebypid[0].attribute[data[i][getattributebypid[0].loopLabel[x]+"_"+qidx]-1],
                    parentlabel: getattributebypid[0].loopLabel[x],
                    kota: data[i]["Kota"],
                    y: 1
                })
            }
        }
    }else if(getattributebypid[0].type == "LOOPMA"){
        for (let i = 0; i < data.length; i++) {
            for (let x = 0; x < getattributebypid[0].loopLabel.length; x++) {
                for (let y = 1; y <= getattributebypid[0].attribute.length; y++) {
                    if(data[i][getattributebypid[0].loopLabel[x]+"_"+qidx+"_O"+y]!=-1){
                        rawdata.push({
                            sbjnum: data[i]["SbjNum"],
                            label: getattributebypid[0].attribute[data[i][getattributebypid[0].loopLabel[x]+"_"+qidx+"_O"+y]-1],
                            parentlabel: getattributebypid[0].loopLabel[x],
                            kota: data[i]["Kota"],
                            y: 1
                        })
                    }   
                }
            }
        }
    }
    res.send(rawdata)
}