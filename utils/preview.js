const dotenv = require("dotenv");
const { link } = require("fs");
const fetch = require("cross-fetch");
const path = require("path");
const pth = __dirname;
dotenv.config({ path: path.join(pth, '../.env') });

const key = process.env.link_key;

PreviewMessage = (mssg) => {
    var prefix_link = `http://api.linkpreview.net/?key=${key}&q=${mssg}`;
    fetch(prefix_link).then(res => res.json()).then(data => {
        return JSON.stringify(data);
    });

};
module.exports = PreviewMessage;