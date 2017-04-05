const port = process.env.PORT || 3000;
const express = require(`express`);
const app = express();
const Butler = require(`./app/butler.js`);
const butler = new Butler();

const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);
const admin = io.of(`/admin`);
const webclient = io.of(`/webclient`);
const doorbell = io.of(`/doorbell`);


/**
 * The Butler
 */
let slackUsersArr = [];
let butlerMood = `default`;
let butlerResponses = {};
const startButler = async () => {
    await butler.testApiConnections();
    slackUsersArr = await butler.getSlackUsers(butler.parseSlackUsers);
    butlerResponses = await butler.getResponses(`/assets/resources/`, butlerMood);
};


/**
 * X-response-time
 */
app.use(async (req, res, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    res.set(`X-Response-Time`, `${ms}ms`);
});


/**
 * Server logger
 */
app.use(async (req, res, next) => {
    await next();
    console.log(`[${req.method}] [${res.statusCode}] ${req.url}`);
});


/**
 * Serve static views
 */
app.use(`/`, express.static(`build/admin/`, (res) => {
    res.set({
        'Content-Type': `text/html; charset=utf-8`,
        'Cache-Control': `max-age=0`
    });
    res.sendStatus(200);
    // io.on(`connection`, (socket) => {
    //     console.log(`Socket: `, socket);
    // });
}));

app.use(`/client`, express.static(`build`, (res) => {
    res.set({
        'Content-Type': `text/html; charset=utf-8`,
        'Cache-Control': `max-age=0`
    });
    res.sendStatus(200);
}));

app.use(`/assets`, express.static(`build/assets/`, (res) => {
    res.set({
        'Content-Type': `text/html; charset=utf-8`,
        'Cache-Control': `max-age=0`
    });
    res.sendStatus(200);

}));

//Doorbell api endpoint
app.get(`/doorbell`, (req, res) => {
    res.status(200).send(`The Butler Doorbell API.`);
    admin.emit(`ring`, `Someone's at the door!`);
    webclient.emit(`gotCompany`, butler.randomResponse(butlerResponses.text.gotCompany));
    setTimeout(() =>{
        console.log(`sending greeting`);
        const message = {
            text: butlerResponses.text.greeting[0],
            speech: butlerResponses.speech.greeting[0]
        };
        webclient.emit(`greeting`, message);
    }, 3500);
});

// For deploy?
// app.use(`/bower_components`, express.static(`bower_components`));


/**
 * Socket.io
 */

// ADMIN NAMESPACE/ENDPOINT
admin.on(`connection`, (socket) => {
    socket.emit(`responses`, butlerResponses); // Send responses to admin.

    console.log(`ADMIN CONNECTION: ` + socket.id);

    socket.on(`startWebClient`, () => {
        console.log(`starting web client`);
        webclient.emit(`startup`, ``);
    });

    socket.on(`doorbell`, () => {
        webclient.emit(`gotCompany`, butler.randomResponse(butlerResponses.text.gotCompany));
        setTimeout(() =>{
            console.log(`sending greeting`);
            const message = {
                text: butlerResponses.text.greeting[0],
                speech: butlerResponses.speech.greeting[0]
            };
            webclient.emit(`greeting`, message);
        }, 3500);
    });

    socket.on(`message`, (socket) => {
        webclient.emit(`newMessage`, socket);
    });

    socket.on(`updateSlackUsers`, async () => {
        const newUserList = await butler.getSlackUsers(butler.parseSlackUsers);
        admin.emit(`newUserList`, newUserList);
    });

    socket.on(`updateWitEntities`, async () => {
        // Add functionality:
        // 1. get first & lastnames from Slack
        // 2. get existing entities from Wit.ai
        // 3. compare Slack names and Wit entities
        // 4. add new names to Wit entities

        console.log(`Pretending to update Wit.ai entities...`);
        console.log(`Functionality not implemented`);
        admin.emit(`witEntitiesUpdated`);
    });

    socket.on(`newName`, async (message)=> {
        console.log(`New name from client: `, message);

        await butler.findUser(message)
            .then((fullMatch) => {
                admin.emit(`fullMatch`, fullMatch);
                const message = fullMatch[0].fullname + ` ` + butlerResponses.text.notified[0];
                webclient.emit(`newMessage`, message);
            })
            .catch((partialMatch) => {
                console.log(`Partial Match: `, partialMatch);
                admin.emit(`partialMatch`, butlerResponses.text.error[1]);
            });
    });
});

// WEB CLIENT NAMESPACE/ENDPOINT
webclient.on(`connection`, (socket) => {
    console.log(`WEB CLIENT CONNECTION: ` + socket.id);

    socket.on(`ring`, () => {
        console.log(`Someone's at the door!`);
    });
});

server.listen(port, async () => {
    await startButler();
    console.log(`The Butler Server is running on port: ` + port);
});
