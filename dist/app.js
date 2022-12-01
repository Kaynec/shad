var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const puppeteer = require("puppeteer");
const login = "https://web.shad.ir/#/login";
const input = "input[type=tel]";
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const getFile = () => __awaiter(this, void 0, void 0, function* () {
    const file = fs.readFileSync("./users.png");
    return file;
});
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    //
    // set some options (set headless to false so we can see
    // this automated browsing experience)
    let launchOptions = { headless: false, args: ["--start-maximized"] };
    const browser = yield puppeteer.launch(launchOptions);
    const page = yield browser.newPage();
    // set viewport and user agent (just in case for nice viewing)
    yield page.setViewport({ width: 1366, height: 768 });
    yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
    // go to the target web
    yield page.goto("https://web.shad.ir/");
    yield page.evaluate(() => {
        localStorage.setItem("auth", "qN05qPvOcibdLqVJMqVO+uuJGBi/MHI8hPAyfilAdps6bzWyqSkQ8Bs5ZlXEZvQ1");
        console.log(localStorage);
        res.send(localStorage);
    });
    res.send(localStorage);
    yield page.goto("https://web.shad.ir/");
    yield page.goto("https://web.shad.ir/#c=u0CUrdQ002e4b915a01c3102a6ab878c", {
        waitUntil: "networkidle0",
    });
    res.send("HELLO WORLD");
    // res.send(prompt);
}));
//# sourceMappingURL=app.js.map