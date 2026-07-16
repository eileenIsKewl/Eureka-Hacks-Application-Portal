import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ });
await page.setViewportSize({ width: 1280, height: 900 });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

async function shot(name) {
  await page.screenshot({ path: `${shotDir}\\${name}.png` });
}

// 1. Landing page
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await shot("01-landing");

// 2. Begin the descent -> apply flow, sunlight zone
await page.click("text=Begin the descent");
await page.waitForSelector("text=Sunlight Zone");
await shot("02-sunlight");

// Fill sunlight fields
await page.fill("#fullName", "Test Diver");
await page.fill("#email", "test.diver@example.com");
await page.fill("#pronouns", "they/them");
await page.fill("#phone", "555-0100");
await page.waitForTimeout(700); // let autosave debounce fire
await shot("03-sunlight-filled");

await page.click("text=Sink deeper");
await page.waitForSelector("text=Twilight Zone");
await shot("04-twilight");

await page.fill("#school", "Test University");
await page.selectOption("#educationLevel", "undergraduate");
await page.fill("#gradYear", "2027");
await page.fill("#fieldOfStudy", "Computer Science");
await page.waitForTimeout(700);

await page.click("text=Descend further");
await page.waitForSelector("text=Midnight Zone");
await shot("05-midnight");

await page.selectOption("#hackathonsAttended", "1-2");
await page.fill("#technicalSkills", "TypeScript, React, Node");
await page.fill("#portfolioUrl", "https://github.com/testdiver");
await page.waitForTimeout(700);

await page.click("text=Drop into the trench");
await page.waitForSelector("text=Abyssal Zone");
await shot("06-abyssal");

await page.fill("#essayWhy", "I want to test this application end to end and make sure the descent feels real and the data actually saves to the database as expected.");
await page.fill("#essayLearn", "I want to learn how a multi step form with autosave and validation can be built well using Next.js and Prisma.");
await page.fill("#essayProject", "I built an automated smoke test script using Playwright that drives a whole hackathon application form through every zone to verify it all works end to end.");
await page.waitForTimeout(700);

await page.click("text=Send it down");
await page.waitForSelector("text=Hadal Zone");
await shot("07-hadal");

// Check console errors so far
console.log("Console errors after form fill:", JSON.stringify(errors));

await browser.close();
