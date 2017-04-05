'use strict';

// Elements
const startButton = document.getElementById(`start-button`);
const slackButton = document.getElementById(`slack-button`);
const slackLoading = document.getElementById(`slack-loading`);
const slackDone = document.getElementById(`slack-done`);
const witButton = document.getElementById(`wit-button`);
const witLoading = document.getElementById(`wit-loading`);
const witDone = document.getElementById(`wit-done`);
const doorbellButton = document.getElementById(`doorbell-button`);
const outputDiv = document.getElementById(`output`);
const textResponseButtons = document.getElementById(`text-response-buttons`);
// const textResponseButton = textResponseButtons.getElementsByTagName(`button`);
const speechResponseButtons = document.getElementById(`speech-response-buttons`);
// const speechResponseButton = speechResponseButtons.getElementsByTagName(`button`);
const nameInput = document.getElementById(`name-input`);
const nameButton = document.getElementById(`name-button`);
const nameStatus = document.getElementById(`name-status`);

// Variables
let slackUsers = {};
let butlerResponses = {};

// Socket.io
const socket = io(`/admin`);
socket.on(`responses`, (response) => {
    butlerResponses = response;
    parseResponses(butlerResponses);
});

socket.on(`ring`, (response) => {
    console.log(response);
});

socket.on(`addSlackUsers`, (response) => {
    slackUsers = response;
    // console.log(slackUsers);
    for (let i in slackUsers) {
        // if (!slackUsers[i].fullname) console.log(slackUsers[i]);
    }
});

socket.on(`newUserList`, (response) => {
    slackUsers = response;
    slackLoading.style.display = `none`;
    slackDone.style.display = `flex`;
    // console.log(slackUsers);
    for (let i in slackUsers) {
        appendOutput(slackUsers[i].fullname + ` ` + slackUsers[i].id);
        // if (!slackUsers[i].fullname) console.log(slackUsers[i]);
    }
});

socket.on(`output`, (response) => {
    for (let i in response) {
        appendOutput(response[i].fullname);
        // if (!slackUsers[i].fullname) console.log(slackUsers[i]);
    }
});

socket.on(`witEntitiesUpdated`, () => {
    witLoading.style.display = `none`;
    witDone.style.display = `flex`;
});

socket.on(`fullMatch`, (user) => {
    nameStatus.innerText = `User ` + user[0].fullname + ` found.`;
});

socket.on(`partialMatch`, (name) => {
    console.log(name);
    nameStatus.innerText = `Only partial name: ` + name + ` was found.`;
});

// Functions
function emitMessage(event, message) {
    console.log(`sending: `, message);
    socket.emit(event, message);
}

function sendName() {
    const name = nameInput.value;
    nameStatus.style.display = `flex`;
    emitMessage(`newName`, name);
}

function updateSlackUsers() {
    slackDone.style.display = `none`;
    slackLoading.style.display = `flex`;
    console.log(`Updating Slack users`);
    socket.emit(`updateSlackUsers`);
}

function updateWitEntities() {
    witDone.style.display = `none`;
    witLoading.style.display = `flex`;
    console.log(`Updating Wit entities`);
    socket.emit(`updateWitEntities`);
}

function startWebClient() {
    console.log(`Start web client`);
    socket.emit(`startWebClient`);
}

function appendOutput(content) {
    if (!content) content = `-`;
    const span = document.createElement(`span`);
    const name = document.createTextNode(content);
    span.appendChild(name);
    outputDiv.appendChild(span);
}

function parseResponses(responses) {
    const text = Object.values(responses.text);
    const speech = Object.values(responses.speech);

    for (let i in text) {
        if (text[i].length > 1) {
            const phraseArr = text[i];
            for (let i in phraseArr) textResponseButtons.appendChild(createButton(phraseArr[i]));
        } else {
            textResponseButtons.appendChild(createButton(text[i]));
        }
    }

    for (let i in speech) {
        if (speech[i].length > 1) {
            const phraseArr = speech[i];
            for (let i in phraseArr) speechResponseButtons.appendChild(createButton(phraseArr[i]));
        } else {
            speechResponseButtons.appendChild(createButton(speech[i]));
        }
    }
}

function createButton(text) {
    // if (text.length > 0) {
        const div = document.createElement(`div`);
        const button = document.createElement(`button`);
        const btnText = document.createTextNode(text);
        button.appendChild(btnText);
        div.appendChild(button);
        return div;
    // }
}

function sendResponse(event) {
    const message = event.target.firstChild.nodeValue;
    emitMessage(`message`, message);
}

function ringDoorbell() {
    emitMessage(`doorbell`, ``);
}

function validateObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// Event Listeners
startButton.addEventListener(`click`, startWebClient, false);
slackButton.addEventListener(`click`, updateSlackUsers, false);
witButton.addEventListener(`click`, updateWitEntities, false);
doorbellButton.addEventListener(`click`, ringDoorbell, false);
nameButton.addEventListener(`click`, sendName, false);
textResponseButtons.addEventListener(`click`, sendResponse, false);
speechResponseButtons.addEventListener(`click`, sendResponse, false);

// Add Listeners to individual buttons
// console.log(textResponseButtons);
// for (let i in textResponseButtons) console.log(textResponseButtons[i].getElementsByTagName(`button`));

// function findButtonsaddListener(element, listener, functionName) {
//     let buttons = element.getElementsByTagName(`button`);
//     console.log(typeof buttons);
//     console.log(buttons.length);

//     for (let i = 0; i < buttons.length; i++) console.log(`buttons`);
// }
// findButtonsaddListener(textResponseButtons, `click`, sendResponse);