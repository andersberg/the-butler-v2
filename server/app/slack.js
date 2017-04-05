const WebClient = require(`@slack/client`).WebClient;
const slackToken = `<ACCESS TOKEN>`;
const slackBotName = `The Ape Butler`;
const slackWebClient = new WebClient(slackToken, slackBotName);

class Slack {
    async testConnection() {
        await this.slackApiTest();
        await this.slackAuthTest();
    }

    slackApiTest() {
        return new Promise( (resolve, reject) => {
            slackWebClient.api.test((error, response) => {
                (error) ? reject(error) : resolve(response);
            });
        });
    }

    slackAuthTest() {
        return new Promise( (resolve, reject) => {
            slackWebClient.auth.test((error, response) => {
                (error) ? reject(error) : resolve(response);
            });
        });
    }

    async getSlackUsers() {
        return new Promise( (resolve, reject) => {
            const presence = true;
            slackWebClient.users.list(presence, (error, response) => {
                (error) ? reject(error) : resolve(this.parseSlackUsers(response));
            });
        });
    }

    async parseSlackUsers(slackUsers) {
        const parsedUsersArr = [];
        for(let i in slackUsers.members) {
            parsedUsersArr.push({
                'id': slackUsers.members[i].id,
                'name': slackUsers.members[i].name,
                'firstname': slackUsers.members[i].profile.first_name,
                'lastname': slackUsers.members[i].profile.last_name,
                'fullname': slackUsers.members[i].profile.real_name_normalized,
                'email': slackUsers.members[i].profile.email,
                'image': slackUsers.members[i].profile.image_512,
                'presence': slackUsers.members[i].presence
            });
        }
        // console.log(parsedUsersArr);
        return parsedUsersArr;
    }

    async messageUser(user) {
        // #butler-test id: C4JJTRX2P
        // @andersberg id: U25QDU1H9
        // Imad id: U2JH4RHD3
        const channel = `U25QDU1H9`;
        const username = `Butler Bot`;
        const message = user[0].fullname + ` has a visitor!`;
        slackWebClient.chat.postMessage(channel, message, username);
    }

    async findChannel() {
        slackWebClient.channels.list((error, response) => {
            for (let i in response.channels) {
                // console.log(response.channels[i].name);
                if (response.channels[i].name == `butler-test`) console.log(response.channels[i]);
            }
        });
    }
}
module.exports = Slack;



