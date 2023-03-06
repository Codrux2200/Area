const { isValidObjectId } = require('mongoose');
const Services = require('../model/Services');
const Actions = require('../model/Actions');
const Reactions = require('../model/Reactions');

const newservice = (req, res) => {
    // const base_action_id = req.body.action_id.split(',');
    // const base_reaction_id = req.body.react_id.split(',');
    const connection = req.body.connection_url;
    const service_name = req.body.service_name;
    const logo = req.body.logo_url;

    if(!service_name || !connection || !logo) {
        return res.status(400).send('missing field : cannot add service')
    }
    // const action_id = [...new Set(base_action_id)];
    // const reaction_id = [...new Set(base_reaction_id)];

    Services.findOne({name: service_name}, (err, data) => {
        if (!data) {
            const new_service = new Services({
                // action_id: action_id,
                // reaction_id: reaction_id,
                name: service_name,
                img_url: logo,
                connection_url: connection
            });
            new_service.save((err, data) => {
                if (err)
                    return res.json({Error: err});
                res.status(201)
                return res.json(data);
            });
        }
        else {
            //if err findone?
            res.status(409)
            res.send("service already exists")
        }
    })
}

const getAllservice = (req, res) => {
    Services.find({}, (err, data) => {
        if (err)
            return res.json({Error: err});
        return res.json(data);
    });
}

const getservice = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service = isValidObjectId(req.params.id) ? await Services.findById(req.params.id) : await Services.findOne({name: req.params.id});
    if (!service) {
            return res.status(404).send("get service error: service not found")
    }
    return res.json(service);
}

const delAllservice = (req, res) => {
    Services.deleteMany({})
}

const delOneservice = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const servicetoremove = isValidObjectId(req.params.id) ? await Services.findByIdAndDelete(req.params.id) : await Services.findOneAndDelete({name: req.params.id});
    if (!servicetoremove)
        return res.status(404).send("del service error: service not found")
    servicetoremove.remove();
    return res.json(servicetoremove);
}

const updateservice = (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const base_action_id = req.body.action_id;
    const base_reaction_id = req.body.reaction_id;
    if (!base_action_id || !base_reaction_id)
        return res.status(400).send('missing field : cannot update service')
    const action_id = [...new Set(base_action_id)];
    const reaction_id = [...new Set(base_reaction_id)];
    Services.updateOne({_id: req.params.id}, {$set: {
        "action_id": action_id,
        "reaction_id": reaction_id,
    }}, (err, data) => {
        if (err) {
            return res.status(400).json({Error: err});}
        return res.json(data);
    });
}

const getActions = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send('missing field : cannot get service actions')
    const service = await Services.findOne({_id: req.params.id});
    if (!service)
        return res.status(404).send('service not found')
    const actions = await Actions.find({_id: {$in: service.action_id}});
    if (!actions)
        return res.status(404).send('actions not found')
    return res.json(actions);
};

const getReactions = async (req, res) => {
    if (!req.params.id || req.params.id == ":id") {
        return res.status(400).send('missing field : cannot get service reactions')
    }
    const service = await Services.findOne({_id: req.params.id});
    if (!service) {
        return res.status(404).send('service not found')
    }
    const reactions = await Reactions.find({_id: {$in: service.reaction_id}});
    if (!reactions)
        return res.status(404).send('actions not found')
    return res.json(reactions);
};

const delActions = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service = await Services.findOne({_id: req.params.id});
    if (!service) {
        return res.status(404).send('service not found')
    }
    service.action_id = [];
    service.save();
    return res.json(service.reaction_id);
};

const delReactions = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service = await Services.findOne({_id: req.params.id});
    if (!service) {
        return res.status(404).send('service not found')
    }
    service.reaction_id = [];
    service.save();
    return res.json(service.reaction_id);};

const delOneAction = async (req, res) => {
    if (!req.params.sid || req.params.id == ":sid" || !req.params.aid || req.params.aid == ":aid")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service = await Services.findOne({_id: req.params.sid});
    if (!service)
        return res.status(404).send('service not found')
    service.action_id = service.action_id.filter((id) => id != req.params.aid);
    service.save();
    return res.json(service.action_id);
};

const delOneReaction = async (req, res) => {
    if (!req.params.sid || req.params.sid == ":sid" || !req.params.rid || req.params.rid == ":rid")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service = await Services.findOne({_id: req.params.sid});
    if (!service) {
        return res.status(404).send('service not found')
    }
    service.action_id.slice(service.action_id.indexOf(req.params.rid), 1);
    service.save();
    return res.json(service.reaction_id);
};

const addAction = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service_to_update = await Services.findOne({_id: req.params.id});
    const action_to_add = await Actions.findOne({name: req.body.name});
    if (!service_to_update || !action_to_add)
        return res.status(404).json({Error: "not found"})
    try {
        if (service_to_update.action_id.indexOf(action_to_add._id) == -1) {
            service_to_update.action_id.push(action_to_add._id);
            service_to_update.save();
            return res.status(200).json(service_to_update.action_id);
        }
        return res.status(400).json({Error: "reaction already in service"});
    } catch (e) {
        console.log(e)
        return res.status(500).json({Error: "internal error"})
    }
};

const addReaction = async (req, res) => {
    if (!req.params.id || req.params.id == ":id")
        return res.status(400).send("get service error: incomplete or erroneous request")
    const service_to_update = await Services.findOne({_id: req.params.id});
    const reaction_to_add = await Reactions.findOne({name: req.body.name});
    if (!service_to_update || !reaction_to_add)
        return res.status(404).json({Error: "not found"})
    try {
        if (service_to_update.reaction_id.indexOf(reaction_to_add._id) == -1) {
            service_to_update.reaction_id.push(reaction_to_add._id);
            service_to_update.save();
            return res.status(200).json(service_to_update.reaction_id);
        }
        return res.status(400).json({Error: "reaction already in service"});
    } catch (e) {
        console.log(e)
        return res.status(500).json({Error: "internal error"})
    }
};

module.exports = {
    updateservice,
    newservice,
    getAllservice,
    delAllservice,
    getservice,
    delOneservice,
    getActions,
    getReactions,
    delActions,
    delReactions,
    delOneAction,
    delOneReaction,
    addAction,
    addReaction
}