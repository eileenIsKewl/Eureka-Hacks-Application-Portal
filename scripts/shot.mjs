import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${shotDir}\\final-sunlight.png` });

// boundary between sunlight and twilight to check fish crossing over
await page.evaluate(() => window.scrollTo(0, 750));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\final-boundary.png` });

await page.evaluate(() => {
  document.getElementById("zone-twilight")?.scrollIntoView();
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\final-twilight.png` });

await browser.close();
