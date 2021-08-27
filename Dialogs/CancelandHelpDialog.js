// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { InputHints,MessageFactory } = require('botbuilder');
const { ComponentDialog,ConfirmPrompt,ChoicePrompt,ChoiceFactory, DialogTurnStatus } = require('botbuilder-dialogs');
//const { DateResolverDialog } = require('./dateResolverDialog');
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
//const ChoicePromptDialog = 'choicePromptDialog';
const CONFIRM_PROMPT = 'confirmPrompt';



/**
 * This base class watches for common phrases like "help" and "cancel" and takes action on them
 * BEFORE they reach the normal bot logic.
 */
class CancelAndHelpDialog extends ComponentDialog {
    
    
    
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
                    // const getWeatherMessageText = 'TODO: get weather flow here';
                   // const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
                  // await innerDc.prompt(CONFIRM_PROMPT, { prompt: "llll" });
                    // await innerDc.context.sendActivity(getWeatherMessageText);
                    await innerDc.beginDialog(applyLeaveDialog);
                    const messageText = "do you want to resume your previous booking"
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
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
