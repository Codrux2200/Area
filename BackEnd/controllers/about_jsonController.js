const IP = require('ip');
const Services = require('../model/Services');
const Actions = require('../model/Actions')
const Reactions = require('../model/Reactions')

const getAboutJson = async (req, res) => {
    var ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress)
    if (ip != "::1")
        ip = ip.split(":")[3]
    const current_time = new Date().getTime();
    const service = await Services.find();
    const services = await Promise.all(service.map(async (serv) => {
        const actions = await Actions.find({_id: serv.action_id});
        const reactions = await Reactions.find({_id: serv.reaction_id});
        return {
            name: serv.name,
            actions: actions.map(action => {
                return {
                    name: action.name,
                    description: action.description
                }
            }),
            reactions: reactions.map(reaction => {
                return {
                    name: reaction.name,
                    description: reaction.description
                }
            })
        }
    }));
    res.json({
        "Clients": {"host": ip},
        "Server": {"current_time": current_time, services}
    });
};

module.exports = { getAboutJson };