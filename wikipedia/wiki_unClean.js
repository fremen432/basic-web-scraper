const puppeteer = require("puppeteer");
const fs = require("fs");

const URL_3 = "https://en.wikipedia.org/wiki/";

const searchTerm_1 = "Jennifer Aniston";
// const element_1 = `//*[@id="mw-content-text"]/div[1]/table`;
const element_1 = `#mw-content-text > div.mw-parser-output > table`;
const element_2 = `#firstHeading`;
const element_3 = "#toc > ul > li.toclevel-1.tocsection-1 > a > span.toctext"; // Early Life

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

	async getCoordinates(thisSelector) {
		/* 
            What we need for a specific screenshot clip:
                - x <number>:       x-coordinate of top-left corner of clip area
                - y <number>:       y-coordinate of top-left corner of clip area
                - width <number>:   width of clipping area
                - height <number>:  height of clipping area

            Process:
                1. find element on the page via the HTML selector
                2. 
        */

		// let thisElement = element_2;
		// return thisSelector;

		// const myEvaluation = (mySelector) => {
		// 	// return 5;
		// 	// const res = "hey";
		// 	// return "hey";
		// 	// return mySelector;
		// 	// let selector = "#firstHeading";

		// 	let target = document.querySelector(mySelector);

		// 	let offsetLeft = target.offsetLeft;
		// 	let offsetTop = target.offsetTop;
		// 	let offsetRight = target.offsetRight;
		// 	let offsetBottom = target.offsetBottom;
		// 	let result = `The coordinates are
		// 	OffsetTop: ${offsetTop},
		// 	OffsetBottom: ${offsetBottom},
		// 	OffsetLeft: ${offsetLeft},
		// 	OffsetRight: ${offsetRight}
		// 	`;
		// 	return result;
		// };

		// const element = await this.page.$(thisSelector).innerHTML;

		const coordinates = await this.page.$eval(thisSelector, (el) => {
			/* 
                The offsetWidth and height are the 
                (https://www.javascripttutorial.net/javascript-dom/javascript-width-height/)
            */

			// let res_innerHTML = el.innerHTM;

			// let width = el.offsetWidth;
			// let height = el.offsetHeight;

			// let offsetTop = el.offsetTop;
			// let offsetBottom = el.offsetBottom;
			// let offsetLeft = el.offsetLeft;
			// let offsetRight = el.offsetRight;

			let domRect = el.getBoundingClientRect();

			// let left = domRect.left.toFixed();
			// let top = domRect.top.toFixed();
			// let height = domRect.height.toFixed();
			// let width = domRect.width.toFixed();

			let x = Number(domRect.left.toFixed());
			let y = Number(domRect.top.toFixed());
			let height = Number(domRect.height.toFixed());
			let width = Number(domRect.width.toFixed());

			// this.coordinates.x = Number(domRect.left.toFixed());
			// this.coordinates.y = Number(domRect.top.toFixed());
			// this.coordinates.rect_height = Number(domRect.height.toFixed());
			// this.coordinates.rect_width = Number(domRect.width.toFixed());

			// return [
			// 	{ x, y, rect_height, rect_width },
			// 	// { offsetTop, offsetBottom, offsetLeft, offsetRight },
			// 	// { height, width },
			// ];

			return { x, y, height, width };
		});

		return coordinates;

		// 	let offsetLeft = target.offsetLeft;
		// 	let offsetTop = target.offsetTop;
		// 	let offsetRight = target.offsetRight;
		// 	let offsetBottom = target.offsetBottom;
		// 	let result = `The coordinates are
		// 	OffsetTop: ${offsetTop},
		// 	OffsetBottom: ${offsetBottom},
		// 	OffsetLeft: ${offsetLeft},
		// 	OffsetRight: ${offsetRight}
		// 	`;
		// 	return result;
		// });
		// return coordinate;
	}

	async getScreenShot(coordinates) {
		// await this.connect();

		// SET CUSTOM SCREEN SIZE
		// this.page.setViewport({
		// 	width: 1300,
		// 	height: 2000,
		// 	deviceScaleFactor: 1,
		// });

		// let x = this.coordinates.x;
		// let y = this.coordinates.y;
		// let width = this.coordinates.width;
		// let height = this.coordinates.height;
		let x = coordinates.x;
		let y = coordinates.y;
		let width = coordinates.width;
		let height = coordinates.height;

		this.screenShot = await this.page.screenshot({
			path: `./images/screenshot${Date.now()}.png`,
			// fullPage: true,
			// clip: {
			// 	x: coordinates.x,
			// 	y: coordinates.y,
			// 	width: coordinates.width,
			// 	height: coordinates.height,
			// },
			clip: {
				x,
				y,
				width,
				height,
			},
		});
		return this.screenShot;

		// this.disConnect();
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
		console.log(items.length);
		// fs.writeFileSync("./results/results.txt", items.join("\r\n"));
		// fs.writeFileSync("./results/results_2.txt", items);
		// console.log(items[0]);
		this.disConnect();
	}
	async opperation_1() {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.getCoordinates(element_3))
			.then((result) => {
				console.log(result);
				return result;
			})

			.then((result) => this.getScreenShot(result))
			.then((result) => {
				console.log(result);
				return result;
			})

			.then(() => this.disConnect());
	}
}

const search_1 = new Search(URL_3, searchTerm_1);

// search_1.printSearchTerm();
// search_1.getIMG_FULL();
// search_1.getScreenShot();
// search_1.grabItems_1();
// search_1.grabItems_3();
search_1.opperation_1();
