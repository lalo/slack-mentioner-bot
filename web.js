// web.js
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var app = express();

var Slack = require('node-slack');
var slack = new Slack("codeandomexico",process.env.SLACK_TOKEN);

app.use(logfmt.requestLogger());
app.use(bodyParser());

var MEMBERS = {"eduardo":"@eduardo"};
var BOTNAME = "slackbot";

app.post('/', function(req, res) {
    var reply = slack.respond(req.body,function(hook) {

        if (hook.user_name == BOTNAME) {
            return {
                text: ""
            };
        }

        words = hook.text.split(/\s+/g);

        for (index = 0; index < words.length; ++index) {
            if (MEMBERS.hasOwnProperty(words[index])) {
                words[index] = MEMBERS[words[index]];
            }
        }

        return {
            text: hook.user_name + ": " + words.join(" ")
        };

    });

    res.json(reply);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
