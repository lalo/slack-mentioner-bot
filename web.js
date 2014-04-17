// web.js
var express = require("express");
var bodyParser = require('body-parser');
var logfmt = require("logfmt");
var app = express();

var Slack = require('node-slack');
var slack = new Slack("codeandomexico",process.env.SLACK_TOKEN);

app.use(logfmt.requestLogger());
app.use(bodyParser());

var storage = require('node-persist');
storage.initSync();

var MEMBERS = storage.getItem('MEMBERS')

if (typeof MEMBERS === 'undefined') {
    MEMBERS = {};
}

var BOTNAME = "slackbot";

app.post('/', function(req, res) {
    var reply = slack.respond(req.body,function(hook) {

        if (hook.user_name == BOTNAME) {
            return {
                text: ""
            };
        }

        words = hook.text.split(/\s+/g);
        no_mention_needed = true;

        if (words[0] == "mentioner") {
            if (words.length == 4 && words[1] == "add") {
                MEMBERS[words[2].toLowerCase()] = "@"+words[3].toLowerCase();
                storage.setItem('MEMBERS', MEMBERS);
            }
            else if (words.length == 3 && words[1] == "delete") {
                if (MEMBERS.hasOwnProperty(words[2].toLowerCase())) {
                    delete MEMBERS[words[2].toLowerCase()];
                    storage.setItem('MEMBERS', MEMBERS);
                }
            }
        }
        else {
            for (index = 0; index < words.length; ++index) {
                if (MEMBERS.hasOwnProperty(words[index].toLowerCase())) {
                    words[index] = MEMBERS[words[index].toLowerCase()];
                    no_mention_needed = false;
                }
            }
        }

        if (no_mention_needed) {
            return {
                text: ""
            };
        }

        return {
            text: hook.user_name + ": " + words.join(" "),
            link_names: 1
        };

    });

    res.json(reply);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
