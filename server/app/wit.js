const witSDK = require(`node-wit`).Wit;
const log = require(`node-wit`).log;
const uuid = require(`node-uuid`);
const fetch = require(`node-fetch`);
const accessToken = `<ACCESS TOKEN>`;


class Wit {
    async testConnection() {
        const actions = {
            send(request, response) {
                // const {sessionId, context, entities} = request;
                // const {text} = response;
                return Promise.resolve();
            },
            confirmConnection(request) {
                const {sessionID, context} = request;
                context.result = `ok`;
                return Promise.resolve(context);
            }
        };
        const logger = new log.Logger(log.ERROR);
        const client = new witSDK({accessToken, actions, logger});
        const sessionId = `Test-` + uuid.v4().substring(0, 5);
        const message = `Butler Connection test`;

        return client.runActions(sessionId, message, {})
            .then((fulfilled) => {
                if (fulfilled.result === `ok`) return Promise.resolve(fulfilled.result);
            })
            .catch((error) => { console.log(`runActions: ` + JSON.stringify(error)); });
    }

    updateEntityValues(entityName, values) {
        const body = {
            'value': values
        };

        const options = {
            'method': `POST`,
            'headers': {
                'Authorization': `Bearer ` + accessToken,
                'Content-Type': `application/json`
            },
            'body': JSON.stringify(body)
        };

        fetch(`https://api.wit.ai/entities/` + entityName + `/values?v=20160526`, options)
            .then((response) => {
                console.log(`updateFirstnameEntity: `, response.status + `-` + response.statusText);
            })
            .catch((error) => {
                console.log(`updateFirstnameEntity Error: `, error);
            });
    }

    checkString(stringToMatch) {
        const actions = {
            send(request, response) {
                return Promise.resolve();
            },
            fullMatch(request) {
                const {sessionID, context, text, entities} = request;
                console.log(`checkString => Full match`);
                return Promise.resolve(entities);
            },
            partialMatch(request) {
                const {sessionID, context, text, entities} = request;
                console.log(`checkString => Partial match`);
                return Promise.reject(entities);
            },
            // nameFromString(request) {
            //     const {sessionID, context, text, entities} = request;
            //     console.log(`checkString => Full match`);
            //     // Match first and lastname
            //     // console.log(`nameFromString entities: `, entities);
            //     return Promise.resolve(entities);
            // },
            // missingFirstname(request) {
            //     const {sessionID, context, text, entities} = request;
            //     console.log(`checkString => Missing firstname`);
            //     // prompt user for new firstname
            //     return Promise.reject(enteties);
            // },
            // missingLastname(request) {
            //     const {sessionID, context} = request;
            //     console.log(`checkString => Missing lastname`);
            //     // prompt user for new lastname
            //     return Promise.reject(enteties);
            // }
        };

        const logger = new log.Logger(log.ERROR);
        const client = new witSDK({accessToken, actions, logger});
        const sessionId = `findUser-` + uuid.v4().substring(0, 5);

        return client.runActions(sessionId, stringToMatch, {})
            .then((fullMatch) => {
                return Promise.resolve(fullMatch);
            })
            .catch((partialMatch) => {
                // console.log(`checkString Error: `, error);
                return Promise.reject(partialMatch);
            });
    }
}
module.exports = Wit;