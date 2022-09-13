import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
// @ts-ignore
import input from "input"; // npm i input
import { LocalStorage } from "node-localstorage"

const apiId =  1;
const apiHash = "...";
const localStorage = new LocalStorage('./');
const item = localStorage.getItem('session')
const stringSession = new StringSession(item ? item : ''); // fill this later with the value from session.save()


(async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    const session = stringSession.save()
    localStorage.setItem('session', session)
    const dialogs = await client.getDialogs({})
    const parseChoice = await input.select("Do you want to parse chats or channels: ", ['Chat', 'Channel'])
    let selectsToShow = []
    for (var dialog of dialogs){
        if(dialog.entity?.className === parseChoice) {
            // @ts-ignore
            selectsToShow.push({name: dialog.id + ' ' + dialog.title + ' (participants: ' + dialog.entity?.participantsCount + ')', value: dialog.id})
        }
    }
    const selectedChat = await input.select("Please select a chat to parse: ", selectsToShow)
    const participants = await client.getParticipants(selectedChat)
    for (var user of participants){
        if(user.username != null)
    console.log('@' + user.username)}
})();