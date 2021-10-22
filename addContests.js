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
    let browser = await puppeteer.launch({ 
        headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: null 
    });
    let pages = await browser.pages();
    let page = pages[0];

    await page.goto(args.url);
    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");
    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");
    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']", configJSO.userid, {
        delay: 30
    });

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJSO.password, {
        delay: 30
    });
    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");
    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");
    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");
    await page.waitForSelector("button[href='/administration/contests/create']");
    await page.click("button[href='/administration/contests/create']");

    for (let i = 0; i < configJSO.cName.length; i++) {

        await page.waitForSelector("input[data-analytics='CreateContestName']");
        await page.type("input[data-analytics='CreateContestName']", configJSO.cName[i], {
            delay: 100
        });

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

        await page.waitForSelector("ins.iCheck-helper");
        await page.click("ins.iCheck-helper");

        await page.waitForSelector("a[href='javascript:void(0)']");
        await page.click("a[href='javascript:void(0)']");

        await page.waitForSelector("li.select2-result-selectable");
        let elementHandle = await page.$$("li.select2-result-selectable");
        await elementHandle[1].click();

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

        await page.waitForSelector("button[data-analytics='CreateContestButton']");
        await page.click("button[data-analytics='CreateContestButton']");

        await page.waitForSelector("button.save-contest");
        await page.click("button.save-contest");

        await page.waitForSelector("a[data-analytics='NavBarContests']");
        await page.click("a[data-analytics='NavBarContests']");

        await page.waitForSelector("a[href='/administration/contests/']");
        await page.click("a[href='/administration/contests/']");

        await page.waitForSelector("button[href='/administration/contests/create']");
        await page.click("button[href='/administration/contests/create']");
    }

}
run();
