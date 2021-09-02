const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, ConfirmPrompt } = require('botbuilder-dialogs');
// const { InputHints, MessageFactory } = require('botbuilder')

const { rootDialog, helpDialog, applyLeaveDialog, payrollDialog } = require('../Constants/DialogIds');
const { HelpDialog } = require('./helpDialog');
const { ApplyLeaveDialog } = require('./applyLeave')
const { PayrollDialog } = require('./payrollDialog')

const parseMessage = 'parseMessage';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT'

class RootDialog extends ComponentDialog {
    constructor(conversationState) {
        super(rootDialog);
        if(!conversationState) throw new Error('ConversationState is required');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(parseMessage, [
            this.routeMessage.bind(this)
        ]));


        this.addDialog(new HelpDialog(conversationState));
        this.addDialog(new ApplyLeaveDialog(conversationState));
        this.addDialog(new PayrollDialog(conversationState));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));

        this.addDialog(new WaterfallDialog('INTERRUPT_DIALOG',[
            this.intentStep.bind(this),
            this.summaryStep.bind(this),
            this.demoStep.bind(this)
        ]))

        this.initialDialogId = parseMessage;

    }

    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dContext = await dialogSet.createContext(context);
        const result = await dContext.continueDialog();
        if(result.status === DialogTurnStatus.empty){
            await dContext.beginDialog(this.id);
        }
    }

    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.trim().toLowerCase();
            let interruptlist = ['help', '?', 'exit', 'cancel', 'quit', 'bye', 'apply leave', 'payroll'];
            if (interruptlist.includes(text)) {
                console.log('interrupt found');
                switch (text) {
                    case 'help':
                    case '?': { 
                        
                        await innerDc.context.sendActivity('helpDialog');
                        return await innerDc.endDialog();
                    }
                    case 'exit':
                    case 'bye':
                    case 'cancel':
                    case 'quit': {
                        await innerDc.context.sendActivity('applyLeave');
                        return await innerDc.cancelAllDialogs();
                    }
                    default: {
                        return await innerDc.beginDialog('INTERRUPT_DIALOG', text);
                    } 
                }
            } else {

                return null;
            }

        }
    }

    async intentStep(stepContext) {
        const text = stepContext.options;
        console.log(stepContext.options)
        switch(text) {
            case 'apply leave':
                return await stepContext.beginDialog(applyLeaveDialog);
            case 'payroll':
                return await stepContext.beginDialog(payrollDialog);
        }
    }

    async summaryStep(stepContext) {
        return await stepContext.prompt(CONFIRM_PROMPT, `You want to continue previous flow`);
    }

    async demoStep(stepContext) {
        if(stepContext.result){
            return await stepContext.continueDialog();
        }
        await stepContext.context.sendActivity("What else can I do for you?");
        return await stepContext.cancelAllDialogs();
    }
    
    async routeMessage(stepContext) {
        console.log(stepContext.context.activity.text.toLowerCase())
        switch(stepContext.context.activity.text.toLowerCase()) {
            case 'apply leave':
                return await stepContext.beginDialog(applyLeaveDialog);
            case 'help':
                console.log('help')
                return await stepContext.beginDialog(helpDialog);
            case 'payroll':
                return await stepContext.beginDialog(payrollDialog);
            default:
                await stepContext.context.sendActivity('You have entered something wrong');
        }
        return await stepContext.endDialog();
    }
}

module.exports.RootDialog = RootDialog;