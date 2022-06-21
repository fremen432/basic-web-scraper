const puppeteer = require("puppeteer");

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

class Product {
    constructor(url) {
        this.url = url;
    }
    printURL() {
        console.log(this.url);
    }
    printProduct() {
        console.log(this);
    }
    async connect() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.page.goto(this.url);
    }
    async disConnect() {
        this.browser.close();
    }
    async getIMG() {
        // xpath of item you want to scrape
        // First we'll scrape the image
        [this.el] = await this.page.$x('//*[@id="imgBlkFront"]');
        // the src is used with images
        this.src = await this.el.getProperty("src");
        this.srcTxt = await this.src.jsonValue();
        // console.log(this.srcTxt);
    }
    async getPrice() {
        [this.el] = await this.page.$x(
            '//*[@id="corePrice_feature_div"]/div/span/span[2]'
            // "/html/body/div[1]/div[2]/div[5]/div[1]/div[5]/div[4]/div/div/div[1]/div/div/div[1]/div/div[1]/a/h5/div[2]/div[1]/div/span/span[2]"
        );
        this.txt = await this.el.getProperty("textContent");
        this.price = await this.txt.jsonValue();
    }

    printMine() {
        let element_1 = this.el;
        let element_2 = this.src;

        console.log({ element_1, element_2 });

        // console.log(this.el);
        // console.log(this.src);
    }
    getIMG_FULL() {
        this.connect()
            .then(() => this.getIMG())
            // .then(() => this.printProduct())
            .then(() => this.printMine())
            .then(() => this.disConnect());
    }
    getPrice_FULL() {
        this.connect()
            .then(() => this.getPrice())
            .then(() => console.log(this.price))
            // .then(() => this.printProduct())
            // .then(() => this.printMine())
            .then(() => this.disConnect());
    }
}

const product_1 = new Product(URL_1);

// product_1.getIMG_FULL();
product_1.getPrice_FULL();
