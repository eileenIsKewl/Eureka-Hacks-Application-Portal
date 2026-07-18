import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

const logs = [];
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));

await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

for (let i = 0; i < 6; i++) {
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(700);
}

console.log("--- ALL CONSOLE LOGS ---");
for (const l of logs) console.log(l);

await browser.close();
