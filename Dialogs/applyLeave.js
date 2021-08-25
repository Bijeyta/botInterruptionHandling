const { ComponentDialog, WaterfallDialog, ChoicePrompt, ChoiceFactory, NumberPrompt, TextPrompt } = require('botbuilder-dialogs');
const { applyLeaveDialog } = require('../Constants/DialogIds')
const { CardFactory } = require('botbuilder');
const { confirmleave } = require('../cards/cards');

//Handling
const { CancelandHelpDialog } = require('./CancelandHelpDialog');

const applyLeaveDialogWF1 = 'helpDialogWF1';
const ChoicePromptDialog = 'ChoicePromptDialog';
const NumberPromptDialog = 'NumberPromptDialog';
const TextPromptDialog = 'TextPromptDialog';

class ApplyLeaveDialog extends ComponentDialog {
    constructor(conversationState) {
        super(applyLeaveDialog);
        if(!conversationState) throw new Error('ConversationState is required');

        this.conversationState = conversationState;
        this.applyLeaveStateAccessor = this.conversationState.createProperty('ApplyLeaveState');

        this.addDialog(new ChoicePrompt(ChoicePromptDialog));
        this.addDialog(new NumberPrompt(NumberPromptDialog));
        this.addDialog(new TextPrompt(TextPromptDialog));
        //Component dialog have functionlality called addDialog, So, we can create different dialogs here, Dialogs are just thee conversation Happning between user and the bot.
        //The most common dialog we use here is Waterfalldialog
        this.addDialog(new WaterfallDialog(applyLeaveDialogWF1, [
            this.askleavetype.bind(this),
            this.askNoOfDays.bind(this),
            this.askleavedate.bind(this),
            this.applyApplication.bind(this)
        ]));

        this.initialDialogId = applyLeaveDialogWF1;
    }

    async askleavetype(stepContext) {
        return await stepContext.prompt(ChoicePromptDialog, {
            prompt: 'Please help me with the type of leave you want to apply',
            choices: ChoiceFactory.toChoices(['Sick Leave', 'Causal Leave', 'Earned Leave'])
        })
        // return await stepContext.endDialog();
    }

    async askNoOfDays(stepContext) {
        let dialogData = await this.applyLeaveStateAccessor.get(stepContext.context, {});
        dialogData.leaveType = stepContext.result.value;
        return await stepContext.prompt(NumberPromptDialog, `Enter the number of days you want to applu for leave ${dialogData.leaveType}`)
    }

    async askleavedate(stepContext) {
        let dialogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        dialogData.leavedays = stepContext.result;
        return await stepContext.prompt(TextPromptDialog, `Enter the date from which you want to apply for the ${dialogData.leaveType}`);
    }

    async applyApplication(stepContext) {
        let dialogData = await this.applyLeaveStateAccessor.get(stepContext.context);
        dialogData.leavedate = stepContext.result; 
        await stepContext.context.sendActivity({
            attachments: [
                CardFactory.adaptiveCard(confirmleave(dialogData.leaveType, dialogData.leavedays, dialogData.leavedate))
            ]
        })
    }

}

module.exports.ApplyLeaveDialog = ApplyLeaveDialog