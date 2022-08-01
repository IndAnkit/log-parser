const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const app = require("./app");
const { CONSTANT } = require("./Constants");

http.createServer(app).listen(CONSTANT.PORT, () => {
	console.log(`Server running at http://127.0.0.1:${CONSTANT.PORT}/`);
});
