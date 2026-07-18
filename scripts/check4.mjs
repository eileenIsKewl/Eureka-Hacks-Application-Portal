import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${shotDir}\\v4-hero.png` });

await page.fill("#fullName", "Test Diver");
await page.fill("#email", "test@example.com");
await page.fill("#phone", "555-0100");
await page.waitForTimeout(500);

await page.click("text=Begin the descent");
await page.waitForTimeout(1500);
await page.screenshot({ path: `${shotDir}\\v4-after-continue-click.png` });

// Check where we actually landed
const info = await page.evaluate(() => {
  const school = document.getElementById("school");
  const rect = school?.getBoundingClientRect();
  return { scrollY: window.scrollY, schoolFieldVisible: rect ? (rect.top > 0 && rect.top < window.innerHeight) : null, rect };
});
console.log("Landing check:", JSON.stringify(info));

await browser.close();
