const launchesModel = require("../../models/launches.model");
const launchesController = {
   getAllLaunches: (req, res) =>{
      return res.json(launchesModel.getAllLaunches());
   },
   addLaunch: (req, res) =>{
     let launch = req.body;
     let sCode = 201;
     launch.launchDate = new Date(launch.launchDate);
     
     if(!isNaN(launch.launchDate.valueOf())){
       launchesModel.addLaunch(launch);
     }else{
       sCode = 400;
     }
     
     return res.status(sCode).json(sCode == 201 ?launch:{"message":"Invalid date"});
     
   },
   abortLaunch: (req, res) => {
    const abortedLaunch = launchesModel.abortLaunch(Number(req.params.launchId));
    return res.json(abortedLaunch);
   }
}

module.exports = launchesController;