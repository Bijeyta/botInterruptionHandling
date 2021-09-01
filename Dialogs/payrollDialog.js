const { ComponentDialog, WaterfallDialog,ChoicePrompt, ChoiceFactory, TextPrompt } = require('botbuilder-dialogs');
const { payrollDialog } = require('../Constants/DialogIds')
const { CardFactory } = require('botbuilder');

const payrollDialogWF1 = 'helpDialogWF1';
const ChoicePromptDialog = 'ChoicePromptDialog';
const TextPromptDialog = 'TextPromptDialog';

class PayrollDialog extends ComponentDialog {
    constructor(conversationState) {
        super(payrollDialog);
        if(!conversationState) throw new Error('ConversationState is required');

        this.conversationState = conversationState;

        this.payrollStateAccessor = this.conversationState.createProperty('PayrollStateAccessor');

        this.addDialog(new ChoicePrompt(ChoicePromptDialog));
        this.addDialog(new TextPrompt(TextPromptDialog));
        //Component dialog have functionlality called addDialog, So, we can create different dialogs here, Dialogs are just thee conversation Happning between user and the bot.
        //The most common dialog we use here is Waterfalldialog
        this.addDialog(new WaterfallDialog(payrollDialogWF1, [
            this.someSuggesstions.bind(this),
            this.askanything.bind(this)
        ]));

        this.initialDialogId = payrollDialogWF1;
    }

    async someSuggesstions(stepContext) {
        return await stepContext.prompt(ChoicePromptDialog, {
            prompt: 'Please help me with the type of option you want for the Payroll',
            choices: ChoiceFactory.toChoices(['RTF', 'CTF', 'MTF'])
        })

    }

    async askanything(stepContext) {
        let dialogData = await this.payrollStateAccessor.get(stepContext.context, {});
        dialogData.promptSelected = stepContext.result.value;
        await stepContext.context.sendActivity(`So you have choosen this prompt ${dialogData.promptSelected}`)
        return stepContext.endDialog();

    }
}

module.exports.PayrollDialog = PayrollDialog;