module.exports = {
    confirmleave: (leaveType, leavedays, leavedate) => {
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "stretch",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": "https://www.celebaltech.com/assets/img/celebal.webp",
                                            "size": "Medium",
                                            "horizontalAlignment": "Center"
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
                                            "size": "Medium",
                                            "text": "Leave Application",
                                            "weight": "Bolder",
                                            "horizontalAlignment": "Center",
                                            "spacing": "Medium"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": "Type of Leave",
                                    "horizontalAlignment": "Center",
                                    "size": "Medium",
                                    "weight": "Bolder"
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
                                    "text": `${leaveType}`,
                                    "size": "Medium",
                                    "horizontalAlignment": "Center",
                                    "weight": "Bolder"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": "Number of Days",
                                    "horizontalAlignment": "Center",
                                    "size": "Medium",
                                    "weight": "Bolder"
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
                                    "text": `${leavedays}`,
                                    "size": "Medium",
                                    "horizontalAlignment": "Center",
                                    "weight": "Bolder"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "wrap": true,
                                    "text": "Leave Date",
                                    "horizontalAlignment": "Center",
                                    "size": "Medium",
                                    "weight": "Bolder"
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
                                    "text": `${leavedate}`,
                                    "size": "Medium",
                                    "horizontalAlignment": "Center",
                                    "weight": "Bolder"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "wrap": true,
                    "size": "Medium",
                    "weight": "Bolder",
                    "horizontalAlignment": "Center",
                    "text": "I have applied for the leave application with above details. To know the status please type \"leave status\".",
                    "color": "Good"
                }
            ]
        }
    }
}