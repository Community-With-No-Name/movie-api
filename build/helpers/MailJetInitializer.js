"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MailJetInit({ receiver, template_id, subject, variables }) {
    const Mailjet = require('node-mailjet');
    const mailjet = Mailjet.apiConnect("e9eaffa461afb81ea8a27096359b6174", "659637bc07b24b92ddc0f54e7f3d11f2");
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
        "Messages": [
            {
                "From": {
                    "Email": "musa4jubril@gmail.com",
                    "Name": "The Movibes Team"
                },
                "To": [
                    {
                        "Email": receiver.email,
                        "Name": receiver.full_name
                    }
                ],
                "TemplateID": template_id,
                "TemplateLanguage": true,
                "Subject": subject,
                "Variables": variables
            }
        ]
    });
    request
        .then(() => {
        return true;
    })
        .catch(() => {
        return false;
    });
}
exports.default = MailJetInit;
