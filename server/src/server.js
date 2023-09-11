const http = require("http");
const app = require("./app");
const planetsModel = require("./models/planets.model");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
   await planetsModel.getPlanetsData();
   server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
   });
} 

startServer()



