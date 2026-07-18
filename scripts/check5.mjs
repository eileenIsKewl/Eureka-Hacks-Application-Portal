import { chromium } from "playwright";

const shotDir = "C:\\Users\\eilee\\AppData\\Local\\Temp\\claude\\c--Users-eilee-Documents-GitHub-Eureka-Hacks-Application-Portal\\a2d26d1e-11fc-4ed9-bb60-96adf7bf5cce\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

await page.goto("http://localhost:3000/apply", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

await page.fill("#fullName", "Test Diver");
await page.fill("#email", "test@example.com");
await page.fill("#phone", "555-0100");
await page.waitForTimeout(400);
await page.click("text=Begin the descent");
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\land-twilight.png` });

await page.fill("#school", "Test U");
await page.selectOption("#educationLevel", "undergraduate");
await page.fill("#gradYear", "2027");
await page.fill("#fieldOfStudy", "CS");
await page.waitForTimeout(400);
await page.click("text=Sink deeper");
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\land-midnight.png` });

await page.selectOption("#hackathonsAttended", "1-2");
await page.fill("#technicalSkills", "TS");
await page.waitForTimeout(400);
await page.click("text=Descend further");
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\land-abyssal.png` });

await page.fill("#essayWhy", "Testing the scroll landing fix end to end across every zone transition button.");
await page.fill("#essayLearn", "Testing whether continue buttons land on real content instead of blank space.");
await page.fill("#essayProject", "Built an automated script that fills and advances through the whole form checking landing positions.");
await page.waitForTimeout(400);
await page.click("text=Drop into the trench");
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}\\land-hadal.png` });

const finalCheck = await page.evaluate(() => {
  const resume = document.querySelector('h2');
  const rect = resume?.getBoundingClientRect();
  return { scrollY: window.scrollY, rect };
});
console.log("Hadal landing:", JSON.stringify(finalCheck));

await browser.close();
