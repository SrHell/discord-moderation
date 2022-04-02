const { readdir } = require("fs")

module.exports = async (client) => {
    try {
        readdir("./events/", (err, files) => {
            if (err) return client.startuptable.addRow('Event Handler', '✘', 'Event', `${Math.round((eventEndTime - eventStartTime) * 1000) / 1000} milliseconds`, `${err}`)
            files.forEach(efile => {
                const event = require(`../events/${efile}`);
                let eventName = efile.split(".")[0];
                client.on(eventName, event.bind(null, client));
            });
        });
    } catch (e) {
        console.log(e)
    }
}