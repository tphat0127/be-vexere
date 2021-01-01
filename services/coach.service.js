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

// GET by id api/coaches/:id
module.exports.getCoachById = (req, res, next) => {
    const {coachId} = req.params

    Coach.findById(coachId)
        .then(coach => {
            if(!coach) return Promise.reject({
                status: 404,
                message: "coach not found"
            })

            return res.status(200).json(coach)
        })
        .catch(err => res.status(404).json(err))
}

//PUT /api/coaches/:coachId
module.exports.replaceCoach = (req, res, next) => {
    const {coachId} = req.params;
    
    return Coach.findById(coachId)
        .then(coach => {
            if(!coach) return Promise.reject({
                status: 404,
                message: "coach not found"
            })
            Object
                .keys(Coach.schema.obj)
                .forEach(key => {
                    coach[key] = req.body[key]
            })

            return coach.save()
        })
        .then(coach => res.status(200).json(coach))
        .catch(err => res.status(500).json(err))
       
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
