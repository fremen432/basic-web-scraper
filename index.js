// Puppetter is a "Headless browser"

const puppeteer = require("puppeteer");

const URL =
	"https://www.amazon.com/Foundation-Isaac-Asimov/dp/0553293354/ref=sr_1_3?keywords=foundation+book+paperback&qid=1655756137&sprefix=foundation+book+paper%2Caps%2C129&sr=8-3";

class Product {
	constructor(url) {
		this.url = url;
	}
	// async init() {
	// 	this.browser = await puppeteer.launch();
	// 	this.page = await this.browser.newPage();
	// }
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
		this.src = await this.el.getProperty("src");
		this.srcTxt = await this.src.jsonValue();
		let srcTxt = this.srcTxt;

		console.log({ srcTxt });
	}

	printURL() {
		console.log(this.url);
	}
	printProduct() {
		console.log(this);
	}

	async getIMG_FULL() {
		this.connect()
			.then(async () => {
				[this.el] = await this.page.$x('//*[@id="imgBlkFront"]');
				this.src = await this.el.getProperty("src");
				this.srcTxt = await this.src.jsonValue();
				let srcTxt = this.srcTxt;

				console.log({ srcTxt });
			})
			.then(() => this.disConnect());
	}

	getIMG_FULL_2() {
		this.connect()
			.then(() => this.getIMG())
			.then(() => this.printProduct())
			.then(() => this.disConnect());
	}
}

// async function scrapeProduct(url) {
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	await page.goto(url);

// 	async function getIMG(url) {
// 		// scrapeProduct(url);

// 		// xpath of item you want to scrape
// 		// First we'll scrape the image
// 		const [el] = await page.$x('//*[@id="imgBlkFront"]');
// 		const src = await el.getProperty("src");
// 		const srcTxt = await src.jsonValue();

// 		console.log({ srcTxt });
// 		// console.log(srcTxt);
// 		browser.close();
// 	}

// 	browser.close();
// }

class Person {
	constructor(name) {
		this.name = name;
	}
	printName() {
		console.log(this.name);
	}
}

const person_1 = new Person("Clayton");

const product_1 = new Product(URL);

// product_1.printURL();
// product_1.getIMG();
// product_1.init().then(() => product_1.printProduct());
// product_1.connect().then(() => product_1.printProduct());
// product_1.connect().then(() => console.log("works"));
// product_1.connect().then(() => product_1.printProduct());

// product_1
// 	.connect()
// 	.then(() => product_1.getIMG())
// 	.then(() => product_1.printProduct())
// 	.then(() => product_1.disConnect());

// product_1.getIMG_FULL();
product_1.getIMG_FULL_2();

// person_1.printName();

// console.log(person_1);

// scrapeProduct(URL);

// scrapeProduct(URL).getIMG();
