const restify = require('restify')
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { BotActivityHandler } = require('./BotActivityHandler')
const { RootDialog } = require('./Dialogs/RootDialog')
const adapter = new BotFrameworkAdapter({
    appId: '',
    appPassword: ''
});

adapter.onTurnError = async (context, error) => {
    console.log('Error has been encountered by Bot', error);
    await context.sendActivity('Error has been encountered by Bot', error);
}

let server = restify.createServer();

server.listen(3978, () => {
    console.log(`${server.name} is listing to the port ${server.url}`);
})

//creating memory storage class to store the memory
const memory = new MemoryStorage();
//defining conversationState i.e ehat is conversation State
let conversationState = new ConversationState(memory);
//activityHandler object
const rootDialog = new RootDialog(conversationState);
const mainBot = new BotActivityHandler(conversationState, rootDialog);

server.post('/api/messages', (req,res) => {
    adapter.processActivity(req,res, async (context) => {
        await mainBot.run(context);
    })
})