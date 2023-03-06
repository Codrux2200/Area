const Reaction = require('../model/Reactions');

const newReaction = async (req, res) => {
    const reaction = await Reaction.findOne({name: req.body.name})
    if (!reaction) {
        if (!req.body.name || !req.body.args || !req.body.description)
            return res.status(400).send("missing field : cannot create Reaction")
        const new_reaction = new Reaction({
            name: req.body.name,
            description: req.body.description,
            args: req.body.args,
        });
        new_reaction.save();
        return res.json(new_reaction);
    }
    return res.status(400).send("Reaction already exists");
}

const getReaction = (req, res) => {
    if (!req.params.id || req.params.id == ":id") 
        return res.status(400).send("get Reaction error: incomplete or erroneous request")
    Reaction.findOne({_id: req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Reaction not found")}
        return res.json(data);
    });
}

const deleteReaction = (req, res) => {
    if (!req.params.id || req.params.id == ":id") 
        return res.status(400).send("del Reaction error: incomplete or erroneous request")
    Reaction.deleteOne({_id :req.params.id}, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        res.status(200)
        return res.json(data);
    });
}

const updateReaction = (req, res) => {
    if (!req.params.id || req.params.id == ":id") 
        return res.status(400).send("mod Reaction error: incomplete or erroneous request")
    const arguments = req.body.args;
    const name = req.body.name;
    const description = req.body.description;
    if (!arguments || !name || !description) {
        res.status(400)
        throw new Error('missing field : cannot update Reaction')
    }
    Reaction.updateOne({_id:req.params.id}, {$set: {"args": arguments, "name": name, "description": description}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

const getAllReaction = (req, res) => {
    Reaction.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data)
            return res.status(404).send("Reaction not found")
        return res.json(data);
    });
};

const deleteAllReaction = async (req, res) => {
    const reactions = await Reaction.deleteMany({});
    if (reactions.deletedCount === 0)
        return res.status(404).send("No Reaction to delete");
    return res.status(200).send("All Reaction deleted");
};

module.exports = {
    newReaction,
    getReaction,
    getAllReaction,
    deleteReaction,
    deleteAllReaction,
    updateReaction
}