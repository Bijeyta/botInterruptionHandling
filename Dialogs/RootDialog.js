const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, runDialog } = require('botbuilder-dialogs');
const { InputHints, MessageFactory } = require('botbuilder')
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

    // async onContinueDialog(innerDc) {
    //     const result = await this.interrupt(innerDc);
    //     if (result) {
    //         return result;
    //     }
    //     return await super.onContinueDialog(innerDc);
    // }

    // async interrupt(innerDc) {
    //     if (innerDc.context.activity.text) {
    //         const text = innerDc.context.activity.text.trim().toLowerCase();
    //         let interruptlist = ['help', '?', 'exit', 'cancel', 'quit', 'bye', 'apply leave', 'payroll'];
    //         if (interruptlist.includes(text)) {
    //             console.log('interrupt found');
    //             switch (text) {
    //                 case 'help':
    //                 case '?': { 
                        
    //                     await innerDc.context.sendActivity('helpDialog');
    //                     return await innerDc.endDialog();
    //                 }
    //                 case 'exit':
    //                 case 'bye':
    //                 case 'cancel':
    //                 case 'quit': {
    //                     await innerDc.context.sendActivity('applyLeave');
    //                     return await innerDc.cancelAllDialogs();
    //                 }
    //                 case 'apply leave':
    //                     // await  innerDc.cancelAllDialogs();
    //                     await innerDc.beginDialog(applyLeaveDialog);
    //                     const messageText = "do you want to resume your previous booking"
    //                     const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    //                     await innerDc.prompt(CONFIRM_PROMPT, { prompt: msg });
    //                     return { status: DialogTurnStatus.waiting };
    //                 case 'payroll':
    //                     return await innerDc.beginDialog(payrollDialog);
                    
    //             }
    //         } else {

    //             return null;
    //         }

    //     }
    // }

    async onContinueDialog(innerDc) {
        //  this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
          const result = await this.interrupt(innerDc);
          console.log("hii",innerDc.context.activity.text)
          if (innerDc.context.activity.text=="No") { 
              console.log("hhhhhh")
           return await innerDc.cancelAllDialogs() }
         // console.log(innerDc,"result")
          if (result) {
             
  
              // if(innerDc.context.activity.text=="No"){
  
              // }
              // else {
                  
              // }
              
              // await innerDc.prompt(CONFIRM_PROMPT);
          //     const messageText = "do you want to resume your previous booking"
          //     const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
          //    await innerDc.prompt(CONFIRM_PROMPT, { prompt: msg });
  
              // await innerDc.replaceDialog(DATE_RESOLVER_DIALOG);
              return result;
          }
          return await super.onContinueDialog(innerDc);
      }
  
      async interrupt(innerDc) {
          if (innerDc.context.activity.text) {
            // this.addDialog(new ConfirmPrompt(ChoicePromptDialog))
              const text = innerDc.context.activity.text.toLowerCase();
  
              // switch (text) {
              // case 'help':
              // case '?': {
              //     const helpMessageText = 'Show help here';
              //     await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
              //     return { status: DialogTurnStatus.waiting };
              // }
              // case 'cancel':
              // case 'quit': {
              //     const cancelMessageText = 'Cancelling...';
              //     await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
              //     return await innerDc.cancelAllDialogs();
              // }
              // }
             // console.log("kkk",text)
              switch (text) {
                  
                  
          
                  case 'payroll': {
                      
                      // We haven't implemented the GetWeatherDialog so we just display a TODO message.
                      const getWeatherMessageText = 'TODO: get weather flow here';
                     // const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                    // await innerDc.prompt(CONFIRM_PROMPT, { prompt: "llll" });
                      await innerDc.context.sendActivity(getWeatherMessageText);
                    //   await innerDc.beginDialog(payrollDialog);
                      const messageText = "do you want to resume your previous booking"
                      console.log(messageText);
                      const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                      await innerDc.prompt(CONFIRM_PROMPT, { prompt: msg });
                    // await innerDc.prompt(CONFIRM_PROMPT, { prompt: "llll" });
  
                      //  await innerDc.context.prompt(ChoicePromptDialog,{
                      //     prompt: "Do you want to place your easy order, most recent order, or new order?",
                      //     choices: ChoiceFactory.toChoices(['Easy Order','Most Recent Order','New Order'])
                      //   })
                     //  await innerDc.context.prompt(ChoicePromptDialog, { prompt: "j" });
                    //  await innerDc.context.sendActivity(getWeatherMessageText, getWeatherMessageText, InputHints.ExpectingInput);
                      return { status: DialogTurnStatus.waiting };
                  }
                  case 'apply leave':
                      await innerDc.beginDialog(applyLeaveDialog);
                      const messageText = "do you want to resume your previous booking"
                      const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                      await innerDc.prompt(CONFIRM_PROMPT, { prompt: msg });
                      return { status: DialogTurnStatus.waiting };
          
                  
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