const planets = require("../../models/planets.model")
const planetController = {
    getPlanets: (req, res) => {
        return res.json(planets.habitablePlanets)
    }
}

module.exports = planetController;