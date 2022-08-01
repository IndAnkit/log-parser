import React, { useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import "./App.css";
const data = [
	{
		timestamp: "2044-08-09T02:12:51.253Z",
		loglevel: "info",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e978",
	},
	{
		timestamp: "2021-08-09T02:12:51.254Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e978",
	},
	{
		timestamp: "2021-08-09T02:12:51.254Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e978",
	},
	{
		timestamp: "2021-08-09T02:12:51.255Z",
		loglevel: "info",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
	},
	{
		timestamp: "2021-08-09T02:12:51.257Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
	},
	{
		timestamp: "2021-08-09T02:12:51.257Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e978",
	},
	{
		timestamp: "2021-08-09T02:12:51.258Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
	},
	{
		timestamp: "2021-08-09T02:12:51.259Z",
		loglevel: "error",
		err: "Not found",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e978",
	},
	{
		timestamp: "2021-08-09T02:12:51.259Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
	},
	{
		timestamp: "2021-08-09T02:12:51.262Z",
		loglevel: "debug",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
	},
	{
		timestamp: "2021-08-09T02:12:51.264Z",
		loglevel: "warn",
		err: "Cannot find user orders list",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e978",
	},
	{
		timestamp: "2021-08-09T02:12:51.265Z",
		loglevel: "info",
		transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
	},
];

const colors = {
	warn: "#FEB95A",
	info: "#28AEF3",
	debug: "#A9DFD8",
	error: "#c55050",
};

const LogComponent = ({ timestamp, loglevel, transactionId, err }) => {
	const logColor = colors[loglevel] || "pink";
	return (
		<div className=" shadow-lg bg-gray-800 flex flex-row overflow-hidden rounded-lg">
			<div
				className={`w-1`}
				style={{
					backgroundColor: logColor,
				}}
			></div>
			<div className="p-2 flex flex-col gap-2">
				<div>{transactionId}</div>
				<div className="flex flex-row gap-4 text-dark-gray text-sm">
					<div className={`uppercase font-bold`} style={{ color: logColor }}>
						{loglevel}
					</div>
					<div>{moment(timestamp).format("DD-MM-YYYY h:mma")}</div>
				</div>
				{err && <div className="text-light-gray">{err}</div>}
			</div>
		</div>
	);
};

function App() {
	const [file, setFile] = useState();
	const [isUploading, setIsUploading] = useState(false);
	const [logData, setLogData] = useState([]);
	const [error, setError] = useState("");

	const inputRef = useRef();

	function handleChange(event) {
		console.log("logData", event.target.files[0]);

		setFile(event.target.files[0]);
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (isUploading) {
			return;
		}
		if (file) {
			setIsUploading(true);
			const url = "http://localhost:9000/api/v1/log-parser";
			const formData = new FormData();
			formData.append("file", file);
			formData.append("fileName", file.name);
			const config = {
				headers: {
					"content-type": "multipart/form-data",
				},
			};
			axios
				.post(url, formData, config)
				.then((response) => {
					setLogData(response.data.data || []);
					setIsUploading(false);
					inputRef.current.value = "";
					setFile();
				})
				.catch((e) => {
					setIsUploading(false);
					setError("Something went wrong");
				});
		} else {
			setError("Please select file");
		}
	}

	return (
		<div className="App m-2 flex flex-col  ">
			<section className="m-2 flex flex-row gap-3 shadow-lg bg-gray-800 p-2 rounded-lg">
				<form className="w-full p-3" onSubmit={handleSubmit}>
					<h1 className="text-center font-bold text-lg mb-2">
						Welcome To Log Parser
					</h1>
					<div>
						<div
							onClick={() => {
								if (isUploading) {
									return;
								}
								setError("");
								inputRef.current.click();
							}}
							className="text-center border-dashed p-8 border-light-green border-2 rounded-md text-light-green font-bold w-full"
						>
							{file
								? "Selected file is : " + file.name
								: "Select Log File To Upload"}
						</div>
						<input
							ref={inputRef}
							className="hidden"
							type="file"
							onChange={handleChange}
						/>
						<div className="flex flex-row mt-4">
							<div className="flex-1 text-red-500">{error}</div>
							<button
								className="bg-light-green p-2 text-primary  rounded-lg"
								type="submit"
							>
								{isUploading ? "Uploading..." : "Upload"}
							</button>
						</div>
					</div>
				</form>
			</section>
			<section className="m-2">
				<div className="flex  flex-col gap-2 mx-2 my-2">
					{logData.map((log, index) => {
						return (
							<LogComponent key={`${log.transactionId} +${index}`} {...log} />
						);
					})}
				</div>
			</section>
		</div>
	);
}

export default App;
