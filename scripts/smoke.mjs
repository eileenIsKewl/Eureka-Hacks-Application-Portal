import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

async function shot(name) {
  await page.screenshot({ path: `${shotDir}\\${name}.png` });
}

await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForSelector("text=Sunlight Zone");
await shot("gauge-sunlight");

await page.fill("#fullName", "Depth Tester");
await page.fill("#email", "depth.tester@example.com");
await page.fill("#phone", "555-0199");
await page.waitForTimeout(700);
await page.click("text=Begin the descent");
await page.waitForSelector("text=Twilight Zone");
await shot("gauge-twilight");

await page.fill("#school", "Test University");
await page.selectOption("#educationLevel", "undergraduate");
await page.fill("#gradYear", "2027");
await page.fill("#fieldOfStudy", "CS");
await page.waitForTimeout(700);
await page.click("text=Descend further");
await page.waitForSelector("text=Midnight Zone");
await shot("gauge-midnight");

await page.selectOption("#hackathonsAttended", "1-2");
await page.fill("#technicalSkills", "TS, React");
await page.waitForTimeout(700);
await page.click("text=Drop into the trench");
await page.waitForSelector("text=Abyssal Zone");
await shot("gauge-abyssal");

await page.fill("#essayWhy", "Testing the descent feel end to end to make sure everything looks right across every zone of the water column.");
await page.fill("#essayLearn", "Testing how the vertical depth gauge sidebar behaves as zones progress deeper.");
await page.fill("#essayProject", "Built an automated visual regression script that walks the whole application flow and captures a screenshot per zone.");
await page.waitForTimeout(700);
await page.click("text=Send it down");
await page.waitForSelector("text=Hadal Zone");
await shot("gauge-hadal");

// mobile viewport check
await page.setViewportSize({ width: 390, height: 844 });
await shot("gauge-hadal-mobile");

console.log("Console errors:", JSON.stringify(errors));
await browser.close();
