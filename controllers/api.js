exports.getApi = async function(req,res){
    res.send("API")
}

exports.getApiProject = async function(req,res){
    const pid = req.params.pid
    res.send(pid)
}

exports.getApiAccess = async function(req,res){
    const pid = req.params.pid
    res.send(`Akses untuk project ${pid}`)
}