const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, runDialog } = require('botbuilder-dialogs');
const { rootDialog, helpDialog, applyLeaveDialog, payrollDialog } = require('../Constants/DialogIds');
const { HelpDialog } = require('./helpDialog');
const { ApplyLeaveDialog } = require('./applyLeave')
const { PayrollDialog } = require('./payrollDialog')

const parseMessage = 'parseMessage';

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

        this.initialDialogId = parseMessage;

    }

    async run(context, accessor) {
        try {
            const dialogSet = new DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = await dialogSet.createContext(context);
            const result = await dialogContext.continueDialog();
            if(result && result.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            } else {
                console.log('Dialog stack is empty');
            } 
        } catch(err) {
            console.log(err);
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
                    case 'apply leave':
                        await  innerDc.cancelAllDialogs();
                        return await innerDc.beginDialog(applyLeaveDialog);
                    case 'payroll':
                        return await innerDc.beginDialog(payrollDialog);
                    
                }
            } else {

                return null;
            }

        }
    }

    async routeMessage(stepContext) {
        // await stepContext.context.sendActivity('in Route Messages');
        switch(stepContext.context.activity.text.toLowerCase()) {
            case 'apply leave':
                return await stepContext.beginDialog(applyLeaveDialog);
            case 'leave status':
                break;
            case 'help':
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