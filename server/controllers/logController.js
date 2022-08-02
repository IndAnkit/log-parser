const fs = require("fs");
const util = require("util");
const stream = require("stream");
const es = require("event-stream");
const moment = require("moment");
const path = require("path");
const multer = require("multer");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const logMemoryUsage = (lineNr) => {
	try {
		console.log("lineNr", lineNr);
		const logData = lineNr.split(" - ");
		let logJson = {};
		let timestamp = Date.parse(new Date(logData[0]));
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
	} catch (err) {
		throw new AppError("Invalid Data Format", 400);
	}
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	cb(null, true);
};

exports.upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.logData = catchAsync(async (req, res) => {
	let logArray = [];
	let logData = req.file.buffer
		.toString()
		.split("\n")
		.filter((ele) => ele);
	logArray = logData.map((oneLog) => logMemoryUsage(oneLog));
	return res.json({ data: logArray });
});
