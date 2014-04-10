// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

var Slack = require('node-slack');
var slack = new Slack("codeandomexico","token-not-needed");

app.use(logfmt.requestLogger());

var MEMBERS = {"eduardo":"@eduardo"};

app.get('/', function(req, res) {
    var reply = slack.respond(req.body,function(hook) {

        words = hook.text.split("\\s+");

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
