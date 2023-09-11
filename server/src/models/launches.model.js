const launches = new Map();
let latestFlightNumber = 100;
const launch = {
    flightNumber: 100,
    mission: 'Mission 1',
    rocket: 'Rocket 1',
    launchDate: new Date('December 13, 2030'),
    target: 'Kepler-443 b',
    customer: ['cust1', 'cust2'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch);

function getAllLaunches(){
    return Array.from(launches.values());
}

function addLaunch(launch){
    latestFlightNumber++;
    Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customer: ['cust 3', 'cust 4'],
        success: true,
        upcoming: true
    });
    launches.set(latestFlightNumber, launch);
}

function abortLaunch(launchId){
   let abortData = launches.get(launchId);
   if(abortData){
     abortData.success = false;
     abortData.upcoming = false;
   }
   return abortData;
}

module.exports = {
    getAllLaunches,
    addLaunch,
    abortLaunch
}