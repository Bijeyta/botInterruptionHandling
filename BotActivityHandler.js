const { ActivityHandler, CardFactory } = require('botbuilder')

class BotActivityHandler extends ActivityHandler {
    constructor(conversationState, rootDialog) {
        super();

        if(!conversationState) throw new Error('Conversation Sate is required!!');

        this.conversationState = conversationState;
        this.rootDialog = rootDialog;
        this.accessor = this.conversationState.createProperty('DialogAccessor')
        //Message event

        this.onMessage(async (context, next) => {
            // await context.sendActivity(`from user => ${context.activity.text}`);
            await this.rootDialog.run(context, this.accessor);
            await next();

            
        });

        //The bot automatically send message when we connect to the bot, This is done through the onConversationUpdate function.
        //This onConversationUpdate functiion triggers two times 1st when bit enters into the conversation and when user enters into the conversation
        this.onConversationUpdate(async(context, next) => {
            if(context.activity.membersAdded && context.activity.membersAdded[0].id && context.activity.from.id) {
                await context.sendActivity({
                    attachments: [CardFactory.adaptiveCard({
                        "type": "AdaptiveCard",
                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                        "version": "1.3",
                        "body": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://celebaltech.com/assets/img/celebal.webp",
                                                "size": "Medium"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "wrap": true,
                                                "text": "Celebal Technologies",
                                                "size": "Medium",
                                                "weight": "Bolder",
                                                "color": "Dark"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "TextBlock",
                                "text": "Microsoft Partner Of The Year 2021",
                                "wrap": true,
                                "height": "stretch",
                                "size": "Small",
                                "color": "Good",
                                "fontType": "Monospace",
                                "horizontalAlignment": "Center",
                                "weight": "Bolder"
                            },
                            {
                                "type": "TextBlock",
                                "wrap": true,
                                "separator": true,
                                "text": "Welcome To Celebal Technologies !!\nThis is Celera, Your helping Partner , How can I help you??"
                            }
                        ]
                    })]
                });

                await context.sendActivity({
                    attachments: [
                        CardFactory.heroCard(
                            'Here are some suggesstions that you can try',
                            null,
                            CardFactory.actions([
                                {
                                    type: 'imBack',
                                    title: 'Apply Leave',
                                    value: 'Apply Leave'
                                },
                                {
                                    type: 'imBack',
                                    title: 'Leave Status',
                                    value: 'Leave Status',
                                },
                                {
                                    type: 'imBack',
                                    title: 'Help',
                                    value: 'Help'
                                }, 
                                {
                                    type: 'imBack',
                                    title: 'Payroll',
                                    value: 'Payroll'
                                }
                            ])
                        )
                    ]
                })
            }
        });
    }

    async run(context) {
        await super.run(context);
        await this.conversationState.saveChanges(context, false);
    }
}

module.exports.BotActivityHandler =BotActivityHandler;