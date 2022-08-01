const express = require("express");
const app = express();
const fs = require("fs");
const util = require("util");
const stream = require("stream");
const es = require("event-stream");
const moment = require("moment");
const path = require("path");

const logMemoryUsage = (lineNr) => {
	const logData = lineNr.split(" - ");
	let logJson = {};
	let timestamp = new Date(logData[0]);
	let loglevel = logData[1];
	let { err, transactionId } = JSON.parse(logData[2]) || {};
	if (err) {
		logJson.err = err;
	}
	return {
		timestamp,
		loglevel,
		err,
		transactionId,
	};
};

app.get("/log-parser", (req, res) => {
	let result = [];
	let logLine;
	let logArray = [];

	const s = fs
		.createReadStream(path.join(__dirname, "data.log"))
		.pipe(es.split())
		.pipe(
			es
				.mapSync(function (line) {
					let isDate = new Date(line.split(" ")[0]);
					s.pause();
					// process line here and call s.resume() when rdy
					// function below was for logging memory usage
					if (moment(isDate).isValid()) {
						if (logLine) {
							let log = logMemoryUsage(logLine);
							logArray.push(log);
						}
						logLine = "";
					}
					logLine += line;
					// resume the readstream, possibly from a callback
					s.resume();
				})
				.on("error", function (err) {
					console.log("Error while reading file.", err);
				})
				.on("end", function () {
					res.json({ data: logArray });
				})
		);
});

module.exports = app;
