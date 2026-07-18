import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${shotDir}\\v3-sunlight-hero.png` });

// Check the real submarine image is actually loading now (not the fallback)
const imgInfo = await page.evaluate(() => {
  const img = document.querySelector('img[src*="submarine-"]');
  if (!img) return "no submarine img found";
  return { src: img.src, complete: img.complete, naturalWidth: img.naturalWidth };
});
console.log("Submarine img check:", JSON.stringify(imgInfo));

// Cycle through submarines with the arrow
await page.click('button[aria-label="Next submarine"]');
await page.waitForTimeout(300);
await page.click('button[aria-label="Next submarine"]');
await page.waitForTimeout(300);
await page.screenshot({ path: `${shotDir}\\v3-cycled.png` });

// Select it
await page.click("text=Select");
await page.waitForTimeout(300);
await page.screenshot({ path: `${shotDir}\\v3-selected.png` });

// Scroll down to see the continuous gradient + follower appear
await page.mouse.wheel(0, 1400);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\v3-scrolled-twilight.png` });

await page.mouse.wheel(0, 1400);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\v3-scrolled-midnight.png` });

await page.mouse.wheel(0, 1600);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\v3-scrolled-abyssal.png` });

await page.mouse.wheel(0, 1600);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\v3-scrolled-hadal.png` });

console.log("Console errors:", JSON.stringify(errors));
await browser.close();
