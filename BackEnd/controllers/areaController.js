const Areas = require('../model/Areas');
const Actions = require('../model/Actions');
const Reactions = require('../model/Reactions');

const newArea = (req, res) => {
    if (req.body.action_id && req.body.reaction_id && req.body.action_arg && req.body.reaction_arg && req.body.user_id && req.body.name) {
        const new_area = new Areas({
            name: req.body.name,
            user_id: req.body.user_id,
            action: {_id: req.body.action_id, args: req.body.action_arg.split(',')},
            reaction: {_id: req.body.reaction_id, args: req.body.reaction_arg},
            actif: true
        });
        new_area.save();
        return res.status(200).json({message: "Area created"});
    }
    return res.status(400).send("could not create area: field missing")
}

const getArea = (req, res) => {
    if (!req.params.id || req.params.id == ":id") {
        res.status(400)
        return res.send("get Area error: incomplete or erroneous request")
    }
    Areas.findOne({_id:req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Area not found")}
        return res.json(data);
    });
}

const getAllArea = (req, res) => {
    Areas.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("no Area found")}
        return res.json(data);
    });
}

const getAreaAct = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get Area error: incomplete or erroneous request")
    const area = await Areas.findById(req.params.id);
    if (!area)
        return res.status(404).send("Area not found")
    const action = await Actions.find({"_id":area.action._id});
    if (!action)
        return res.status(404).send("Action not found")
    return res.status(200).json(action);
}

const getAreaReact = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get Area error: incomplete or erroneous request")
    const area = await Areas.findById(req.params.id);
    if (!area)
        return res.status(404).send("Area not found")
    const reaction = await Reactions.findById(area.reaction._id);
    if (!reaction)
        return res.status(404).send("Reaction not found")
    return res.status(200).json(reaction);
}

const updateArea = async (req, res) => {
    if (!req.params.id || req.params.id == ":id") 
        return res.status(400).send("get Area error: incomplete or erroneous request")
    if (!req.body.action_id || !req.body.reaction_id || !req.body.action_arg || !req.body.reaction_arg || !req.body.name) {
        res.status(400)
        throw new Error('missing field : cannot update area')
    }
    const area_to_update = await Areas.findOne({_id: req.params.id});
    if (!area_to_update)
        return res.status(404).send("Area not found")
    try {
        area_to_update.name = req.body.name
        area_to_update.action._id = req.body.action_id
        area_to_update.action.args = req.body.action_arg
        area_to_update.reaction._id = req.body.reaction_id
        area_to_update.reaction.args = req.body.reaction_arg
        area_to_update.save();
        return res.status(200).json({message: "Area updated"});
    } catch (err) {
        return res.status(400).send("could not update area")
    }
}

const updateAreaState = async (req, res) => {
    if (!req.params.id || req.params.id == ":id") 
        return res.status(400).send("get Area error: incomplete or erroneous request")
    const area_to_update = await Areas.findOne({_id: req.params.id});
    try {
        if (area_to_update) {
            area_to_update.actif = !area_to_update.actif
            area_to_update.save();
            return res.status(200).json({message: "Area updated"});
        }
    } catch (err) {
        return res.status(500).json({ "error": 'internal error' });
    }
}

const delOneArea = (req, res) => {
    if (!req.params.id || req.params.id == ":id") 
        return res.status(400).send("get Area error: incomplete or erroneous request")
    try {
        Areas.deleteOne({_id:req.params.id}, (err, data) => {
            if (err)
                return res.json({Error: err});
            res.status(200)
            return res.json(data);
        });
    } catch (err) {
        return res.status(500).send('internal error');
    }
}

const delAllArea = async (req, res) => {
    const area_deleted = await Areas.deleteMany({})
    if (area_deleted.deletedCount === 0)
        return res.status(404).send("no Area found")
    return res.status(200).json({message: "All Area deleted"});
}

module.exports = {
    newArea,
    getArea,
    getAreaAct,
    getAreaReact,
    getAllArea,
    delOneArea,
    delAllArea,
    updateArea,
    updateAreaState,
}