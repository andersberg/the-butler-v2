/**
 * Butler API
 */
const fs = require(`fs`);
const path = require(`path`);
const Slack = require(`./slack.js`);
const slack = new Slack();
const Wit = require(`./wit.js`);
const wit = new Wit();
let slackUsersArr = [];

class Butler {
    async testApiConnections() {
        // Updates Wit.ai entity values.
        // wit.updateEntityValues(`firstname`, `Joakim`);

        await slack.testConnection()
            .then(() => { console.log(`Slack Api connection is ok.`); })
            .catch((error) => { console.log(error); });

        await wit.testConnection()
            .then((result) => { console.log(`Wit Api Connection is ` + result); })
            .catch((error) => { console.log(error); });
    }

    async getSlackUsers() {
        slackUsersArr = await slack.getSlackUsers();
        return Promise.resolve(slackUsersArr);
    }

    async findUser(stringToMatch) {
        return new Promise((resolve, reject) => {
            wit.checkString(stringToMatch)
                .then((fullMatch) => {
                    const user = {
                        'firstname': fullMatch.firstname[0].value,
                        'lastname': fullMatch.lastname[0].value
                    };
                    this.matchUser(user, slackUsersArr)
                        .then((user) => {
                            console.log(`matchUser resolve: `, user.length);
                            if (user.length == 1) slack.messageUser(user);
                            resolve(user);
                        })
                        .catch((error) => {
                            resolve(error);
                        });
                })
                .catch((partialMatch) => {
                    const user = {
                        'firstname': partialMatch.firstname[0].value
                    };
                    this.matchUser(user, slackUsersArr)
                        .then((user) => {
                            console.log(`matchUser resolve: `, user.length);
                            if (user.length == 1) slack.messageUser(user);
                            reject(user);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
        });
    }


    matchUser(witMatch, slackUsersArr) {
        let resultArr = [];
        if (witMatch.lastname) {
            for (let i in slackUsersArr) {
                if (witMatch.firstname === slackUsersArr[i].firstname &&
                witMatch.lastname === slackUsersArr[i].lastname) resultArr.push(slackUsersArr[i]);
            }
            return (resultArr) ? Promise.resolve(resultArr) : Promise.reject();
        } else {
            for (let i in slackUsersArr) {
                if (witMatch.firstname === slackUsersArr[i].firstname ||
                witMatch.firstname === slackUsersArr[i].lastname) resultArr.push(slackUsersArr[i]);
            }
            return (resultArr) ? Promise.resolve(resultArr) : Promise.reject();
        }
    }

    async loadJSON(filePath) {
        return new Promise((resolve, reject) => {
            const JSONfile = path.join(path.dirname(module.parent.filename), filePath);
            fs.readFile(JSONfile, `utf-8`, async (error, data) => {
                return  (error) ? reject(error) : resolve(data);
            });
        });

    }

    getResponses(filepath, mood) {
        return new Promise((resolve, reject) => {
            this.loadJSON(filepath + mood + `.json`)
            .then((json) => {
                this.parseResponses(json, mood)
                .then((responses) => {
                    resolve(responses);
                })
                .catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    parseResponses(json, mood) {
        json = JSON.parse(json);
        const responses = json[mood];
        return Promise.resolve(responses);
    }

    randomResponse(responseArr) {
        return responseArr[Math.floor(Math.random() * responseArr.length)];
    }
}
module.exports = Butler;