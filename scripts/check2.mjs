import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push("PAGEERROR: " + String(err)));

await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${shotDir}\\top.png` });

// Check for dead space above hero
const heroTop = await page.evaluate(() => {
  const section = document.getElementById("zone-sunlight");
  const h1 = document.querySelector("h1");
  return {
    sectionTop: section?.getBoundingClientRect().top,
    h1Top: h1?.getBoundingClientRect().top,
  };
});
console.log("Hero top check:", JSON.stringify(heroTop));

// Scroll with real wheel events, checking follower each time
for (let i = 0; i < 6; i++) {
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(900);
}
await page.screenshot({ path: `${shotDir}\\after-scroll.png` });

const followerInfo = await page.evaluate(() => {
  const img = document.querySelector('img[alt="Your submarine"]');
  if (!img) return { found: false };
  const rect = img.getBoundingClientRect();
  let node = img;
  const opacities = [];
  while (node && node !== document.body) {
    opacities.push(getComputedStyle(node).opacity);
    node = node.parentElement;
  }
  return { found: true, rect, opacities, scrollY: window.scrollY, src: img.src };
});
console.log("Follower after scroll:", JSON.stringify(followerInfo));
console.log("Console errors:", JSON.stringify(errors));

await browser.close();
