// node addContests.js --url=https://www.hackerrank.com/ --config=config.json

// npm init -y
// npm install minimist
// npm install puppeteer-core

let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");
const {
    config
} = require("process");

let args = minimist(process.argv);
let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);


async function run() {
    // jo bhi promise return kar rahe hai waha await istamal karna padega
    let browser = await puppeteer.launch({ // start the browser
        headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: null // ye line hume nahi samajhni hai
    }); // mujhe browser mil gaya
    // get the tabs (there is only one tab)
    let pages = await browser.pages(); // mujhe pages mil gaye 
    let page = pages[0];

    // open the url
    await page.goto(args.url);

    // wait and then click on login on page1
    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    // wait and then login on page2
    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    // type userid
    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", configJSO.userid, {
        delay: 30
    });

    // type password
    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, {
        delay: 30
    });

    // press click on page3
    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    // click on compete
    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    // click on manage contests
    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    // click on create contest
    await page.waitForSelector("button[href='/administration/contests/create']");
    await page.click("button[href='/administration/contests/create']");

    for (let i = 0; i < configJSO.cName.length; i++) {

        // create contest name
        await page.waitForSelector("input[data-analytics='CreateContestName']");
        await page.type("input[data-analytics='CreateContestName']", configJSO.cName[i], {
            delay: 100
        });

        // Set date and time 
        await page.waitForSelector("input[data-analytics='CreateContestStartDate']");
        await page.type("input[data-analytics='CreateContestStartDate']", configJSO.sDate, {
            delay: 100
        });
        await page.keyboard.press('Enter');

        await page.waitForSelector("input#starttime");
        await page.type("input#starttime", configJSO.sTime, {
            delay: 100
        });
        await page.keyboard.press('Enter');


        // Selecting the check Box
        await page.waitForSelector("ins.iCheck-helper");
        await page.click("ins.iCheck-helper");

        // Selecting organization type
        await page.waitForSelector("a[href='javascript:void(0)']");
        await page.click("a[href='javascript:void(0)']");

        await page.waitForSelector("li.select2-result-selectable");
        let elementHandle = await page.$$("li.select2-result-selectable");
        await elementHandle[1].click();

        // Selecting and typing organization name 

        await page.waitForSelector("a[href='javascript:void(0)']");
        let elementHandle1= await page.$$("a[href='javascript:void(0)']");
        await elementHandle1[1].click();

        await page.waitForSelector("input.select2-input");
        let handle = await page.$$("input.select2-input");
        await handle[1].type("input.select2-input", configJSO.oName, {
            delay: 500
        });

        await page.waitForSelector("div.college-title");
        let elementHandle2= await page.$$("div.college-title");
        await elementHandle2[0].click();

        // clicking getting started button
        await page.waitForSelector("button[data-analytics='CreateContestButton']");
        await page.click("button[data-analytics='CreateContestButton']");

        // click on save changes button
        await page.waitForSelector("button.save-contest");
        await page.click("button.save-contest");

        // click on compete
        await page.waitForSelector("a[data-analytics='NavBarContests']");
        await page.click("a[data-analytics='NavBarContests']");

        // click on manage contests
        await page.waitForSelector("a[href='/administration/contests/']");
        await page.click("a[href='/administration/contests/']");

        // click on create contest
        await page.waitForSelector("button[href='/administration/contests/create']");
        await page.click("button[href='/administration/contests/create']");
    }

}
run();