const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");
const URL = require("url");

const { unlink } = require("fs/promises");

const downloadFile = async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

app.post("/", async (req, res) => {
  const yourPersonalPageUrl = req.body.page;
  const token = req.body.token;
  const fileLink = req.body.link;

  //

  // const lastThree = fileLink.substr(fileLink.length - 3);

  const parsed = URL.parse(fileLink);

  const pathname = "media" + path.basename(parsed.pathname);

  try {
    await downloadFile(fileLink, pathname);
  } catch (error) {
    console.log("there was an error");
  }

  const url = "http://web.shad.ir";
  let launchOptions = { headless: false, args: ["--start-maximized"] };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  // go to the target web
  await page.goto(url);

  await delay(10);

  (await page).evaluate((tok) => {
    window.localStorage.setItem("auth", `"${tok}"`);
  }, token);

  await delay(10);

  // await page.reload();
  await page.reload();

  await delay(10);

  await page.goto(yourPersonalPageUrl);

  await delay(10);

  await page.waitForSelector("input[type=file]");

  // get the ElementHandle of the selector above
  const inputUploadHandle = await page.$("input[type=file]");

  await inputUploadHandle.uploadFile(pathname);

  await page.click("button[rb-focused]");

  await page.waitForNetworkIdle();

  try {
    await unlink(pathname);
    console.log("successfully deleted", pathname);
  } catch (error) {
    console.error("there was an error:", error.message);
  }

  await browser.close();

  res.send({ status: 200 });
});
