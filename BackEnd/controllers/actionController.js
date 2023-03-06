const Action = require('../model/Actions');

const newAction = async (req, res) => {
    const action = await Action.findOne({name: req.body.name});
    if (!action) {
        if (!req.body.name || !req.body.description || !req.body.args) {
            return res.status(400).send('missing field : cannot create action');
        }
        const new_action = new Action({
            name: req.body.name,
            args: req.body.args,
            description: req.body.description
        });
        new_action.save();
        return res.json(new_action);
    }
    return res.status(400).send("Action already exists");
}

const getAction = (req, res) => {
    if (!req.params.id || !req.params.id == ":id")
        return res.status(400).send("get Action error: incomplete or erroneous request")
    Action.findOne({_id:req.params.id}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Action not found")}
        return res.json(data);
    });
}

const getAllAction = (req, res) => {
    Action.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        if (!data) {
            res.status(404)
            return res.send("Action not found")}
        return res.json(data);
    });
}

const deleteAction = (req, res) => {
    if (!req.params.id || !req.params.id == ":id")
        return res.status(400).send("del Action error: incomplete or erroneous request")
    Action.deleteOne({_id:req.params.id}, (err, data) => {
        if (err) {
            return res.json({Error: err});
        }
        res.status(200)
        return res.json(data);
    });
}

const updateAction = (req, res) => {
    if (!req.params.id || !req.params.id == ":id")
        return res.status(400).send("mod Action error: incomplete or erroneous request")
    const arguments = req.body.args;
    const name = req.body.name;
    const description = req.body.description;
    if (!arguments || !name || !description) {
        res.status(400)
        throw new Error('missing field : cannot update Action')
    }
    Action.updateOne({_id:req.params.id}, {$set: {"args": arguments, "name": name, "description": description}}, (err, data) => {
        if (err) {
            res.status(400)
            return res.json({Error: err});}
        return res.json(data);
    });
}

const deleteAllAction = async (req, res) => {
    const actions = await Action.deleteMany({});
    if (actions.deletedCount === 0)
        return res.status(404).send("No actions to delete");
    return res.status(200).send("All actions deleted");
};

module.exports = {
    newAction,
    getAction,
    getAllAction,
    deleteAction,
    deleteAllAction,
    updateAction
}