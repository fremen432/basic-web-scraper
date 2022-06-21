const puppeteer = require("puppeteer");
const fs = require("fs");

const URL_1 =
    "https://www.amazon.com/Foundation-Isaac-Asimov/dp/0553293354/ref=sr_1_3?keywords=foundation+book+paperback&qid=1655756137&sprefix=foundation+book+paper%2Caps%2C129&sr=8-3";

const URL_2 = `
    https://www.amazon.com/
    s?
    crid=1NF5CWYRKLFN&i=stripbooks
    &k=
    &ref=nb_sb_noss
    &sprefix=%2Cstripbooks%2C132
    &url=search-alias%3Dstripbooks
`;

const URL_3 = "https://en.wikipedia.org/wiki/";

const searchTerm_1 = "Jennifer Aniston";

class Search {
    constructor(baseURL, searchTerm) {
        this.baseURL = baseURL;
        this.searchTerm = searchTerm.replace(" ", "_");
        this.fullURL = this.baseURL + this.searchTerm;
    }
    async connect() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.page.goto(this.fullURL);
    }
    disConnect() {
        this.browser.close();
    }

    printSearchTerm() {
        console.log(this.searchTerm);
    }
    printURL() {
        console.log(this.fullURL);
    }
    printProduct() {
        console.log(this);
    }
    printMine() {
        let element_1 = this.firstParagraph;
        let element_2 = this.srcTxt;

        console.log({ element_1, element_2 });
    }

    async getScreenShot() {
        await this.connect();

        this.screenShot = await this.page.screenshot({
            path: "./images/screenshot.png",
            fullPage: true,
        });

        this.disConnect();
    }
    async getIMG() {
        await this.connect();

        [this.el] = await this.page.$x(
            '//*[@id="mw-content-text"]/div[1]/table[1]/tbody/tr[2]/td/a/img'
        );
        this.src = await this.el.getProperty("src");
        this.srcTxt = await this.src.jsonValue();

        this.disConnect();
    }
    async getFirstParagraph() {
        await this.connect();

        [this.el] = await this.page.$x(
            '//*[@id="mw-content-text"]/div[1]/p[2]'
        );
        this.txt = await this.el.getProperty("textContent");
        this.firstParagraph = await this.txt.jsonValue();

        this.disConnect();
    }
    async grabItems_1() {
        await this.connect();
        let items = await this.page.evaluate(() => {
            // return document.querySelector("div.mw-parser-output p").textContent;
            // return document.querySelector("td.infobox-data").textContent;
            // return document.querySelector("th.infobox-label").innerHTML;
            // return document.querySelector("ul li.toclevel-1 a").textContent;
            return Array.from(
                document.querySelectorAll("ul li.toclevel-1 a")
            ).map((x) => x.textContent);
        });
        console.log(items);
        this.disConnect();
    }
    async grabItems_2() {
        await this.connect();
        let items = await this.page.$$eval("ul li.toclevel-1 a", (elements) => {
            return elements.map((el) => el.textContent);
        });
        console.log(items);
        this.disConnect();
    }
    async grabItems_3() {
        await this.connect();
        let items = await this.page.$$eval(
            "#mw-content-text div.mw-parser-output",
            (elements) => {
                return elements.map((el) => el.textContent);
            }
        );
        fs.writeFileSync("./results/results.txt", items.join("\r\n"));
        // fs.writeFileSync("./results/results_2.txt", items);
        // console.log(items[0]);
        this.disConnect();
    }
}

const search_1 = new Search(URL_3, searchTerm_1);

// search_1.printSearchTerm();
// search_1.getIMG_FULL();
// search_1.getScreenShot();
// search_1.grabItems_1();
search_1.grabItems_3();
