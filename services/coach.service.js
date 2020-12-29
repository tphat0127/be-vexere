const {Coach} = require('./../models/coach.model');

//POST api/coachs
module.exports.createCoach = (req, res, next) => {
    const { name, thumbnail, seats } = req.body;
    return Coach.create({ name, thumbnail, seats })
        .then((coach) => {
            return res.status(200).json(coach);
        })
        .catch((err) => {
            return res.status(500).json(err);
        })
}

//GET api/coachs
module.exports.getCoach = (req, res, next) => {
    return Coach.find()
        .then(coach => {
            return res.status(200).json(coach)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
}
// DELETE api/coachs/:id
module.exports.deleteCoach = (req, res, next) => {
    const {coachID} = req.params
    let _coach;
    Coach.findById(coachID)
        .then(coach => {
            if(!coach) return Promise.reject({
                status: 404,
                message: "Coach not found"
            })
            _coach = coach
            return coach.deleteOne()
        })
        .then(() => res.status(200).json(_coach))
        .catch(err => res.status(404).json(err))
}
