require("../lib/dataExcel");
require("../lib/index");

exports.getSplitData = async function (req, res) {
  var pid = req.params.pid;
  var project = await projectByPid(pid);
  if(project.length > 0){
    
  }else{
    res.status(404).send("Project Not found");
  }
};
