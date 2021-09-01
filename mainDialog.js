const { UserProfileDialog, USER_PROFILE_DIALOG } = require('./userProfileDialog');
const { FundTransferDialog, FUND_TRANSFER_DIALOG } = require('./fundTransferDialog');
const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, ConfirmPrompt } = require('botbuilder-dialogs');
const { InputHints } = require('botbuilder');
const { createAccRecognizer } = require('./createAccRecognizer');
const { LuisRecognizer } = require('botbuilder-ai');
const { QnAMaker } = require('botbuilder-ai');

const MAIN_DIALOG = 'MAIN_DIALOG';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer, userState){
        super(MAIN_DIALOG);

        try {
            this.qnaMaker = new QnAMaker({
                knowledgeBaseId: process.env.QnAKnowledgebaseId,
                endpointKey: process.env.QnAEndpointKey,
                host: process.env.QnAEndpointHostName
            });
        } catch (err) {
            console.warn(`Check your QnAMaker configuration`);
        }

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter luisRecognizer');
       
        this.luisRecognizer = luisRecognizer;
        this.userState = userState;
        this.userProfileAccessor = userState.createProperty('USER_PROFILE_PROPERTY')
        
        this.addDialog(new UserProfileDialog());
        this.addDialog(new FundTransferDialog());
        this.addDialog(new ConfirmPrompt('CONFIRM_PROMPT'));
        this.addDialog(new WaterfallDialog('WATERFALL_DIALOG',[
            this.initialStep.bind(this),
            this.finalStep.bind(this),
        ]))
        this.addDialog(new WaterfallDialog('INTERRUPT_DIALOG',[
            this.intentStep.bind(this),
            this.summaryStep.bind(this),
            this.demoStep.bind(this)
        ]))

        this.initialDialogId = 'WATERFALL_DIALOG';
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
            const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
            const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: LuisAPIHostName };

            const luisRecognizer = new createAccRecognizer(luisConfig);
            const luisResult = await luisRecognizer.executeLuisQuery(innerDc.context);
            
            const text = innerDc.context.activity.text.toLowerCase();
            switch (text) {
                case 'help':
                case '?': {
                    const helpMessageText = 'Show help here';
                    await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                    return { status: DialogTurnStatus.waiting };
                }
                case 'cancel':
                case 'quit': {
                    const cancelMessageText = 'Cancelling...';
                    await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                    return await innerDc.cancelAllDialogs();
                }
                default: {
                    //const luisResult = await this.luisRecognizer.executeLuisQuery(innerDc.context);
                    if(LuisRecognizer.topIntent(luisResult) != 'None' ){
                        console.log(LuisRecognizer.topIntent(luisResult));
                        const intent = LuisRecognizer.topIntent(luisResult);
                        await innerDc.beginDialog('INTERRUPT_DIALOG', {intent: intent, luisResult: luisResult});
                        return { status: DialogTurnStatus.waiting };
                    }
                }
            }
        }
    }

    async initialStep(stepContext) {
        const details = {};
        if (!this.luisRecognizer.isConfigured) {
            await stepContext.context.sendActivity('LUIS is not configured.', null, InputHints.IgnoringInput);
            return await stepContext.next();
        }
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        switch (LuisRecognizer.topIntent(luisResult)) {
            case 'CreateAccount': {
                const accType = this.luisRecognizer.getAccType(luisResult);
                details.accType = accType.type;
                return await stepContext.beginDialog(USER_PROFILE_DIALOG, details);
            }
    
            case 'FundTransfer': {
                const entityAmount = this.luisRecognizer.getAmount(luisResult);
                const BeneficiaryName = this.luisRecognizer.getBeneficiaryName(luisResult);
                details.amount = entityAmount.amount;
                details.bName = BeneficiaryName.name;
                return await stepContext.beginDialog(FUND_TRANSFER_DIALOG, details);
            }
    
            default: {
                if (!process.env.QnAKnowledgebaseId || !process.env.QnAEndpointKey || !process.env.QnAEndpointHostName) {
                    return await stepContext.context.sendActivity('QnA Maker is not configured.');
                } else {
                    const qnaResults = await this.qnaMaker.getAnswers(stepContext.context);
                    console.log(qnaResults);
                    if (qnaResults[0]) {
                        return await stepContext.context.sendActivity(qnaResults[0].answer);
                    } else {
                        return await stepContext.context.sendActivity(`Sorry, I didn't get that. Please try asking in a different way.`);
                    }
                }
                //const didntUnderstandText = `Sorry, I didn't get that. Please try asking in a different way.`;
                //return await stepContext.context.sendActivity(didntUnderstandText, didntUnderstandText, InputHints.IgnoringInput);
            }
        }
    }
    
    async finalStep(stepContext) {
        await stepContext.context.sendActivity("What else can I do for you?");
        return await stepContext.endDialog();
    }

    async intentStep(stepContext) {
        const intent = stepContext.options.intent;
        const details = {};
        switch (intent) {
            case 'CreateAccount': {
                const accType = this.luisRecognizer.getAccType(stepContext.options.luisResult);
                details.accType = accType.type;
                await stepContext.beginDialog(USER_PROFILE_DIALOG, details);
                return { status: DialogTurnStatus.waiting };
            }
            case 'FundTransfer': {
                const entityAmount = this.luisRecognizer.getAmount(stepContext.options.luisResult);
                const BeneficiaryName = this.luisRecognizer.getBeneficiaryName(stepContext.options.luisResult);
                details.amount = entityAmount.amount;
                details.bName = BeneficiaryName.name;
                await stepContext.beginDialog(FUND_TRANSFER_DIALOG, details);
                return { status: DialogTurnStatus.waiting };
            }
            default: {
                console.log('default_164 executed');
            }
        }
    }

    async summaryStep(stepContext) {
        return await stepContext.prompt('CONFIRM_PROMPT', `You want to continue previous flow`);
    }

    async demoStep(stepContext) {
        if(stepContext.result){
            //PRINT ALL ACTIVE DIALOGS --> console.log(stepContext.dialogs.dialogs)
            //PRINT PARENT DIALOG --> console.log(stepContext.parent.dialogs)
            return await stepContext.continueDialog();
        }
        await stepContext.context.sendActivity("What else can I do for you?");
        return await stepContext.cancelAllDialogs();
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;