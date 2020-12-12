const {Coach} = require('./../models/coach.model');

//POST api/coachs
module.exports.createCoach = (req, res, next) => {
    const { name, avatar, seatCount } = req.body;
    return Coach.create({ name, avatar, seatCount })
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