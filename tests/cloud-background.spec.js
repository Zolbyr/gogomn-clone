const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.cloudStats = { draws: 0, programs: 0 };
    const drawArrays = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      if (this.canvas.hasAttribute("data-cloud-canvas")) window.cloudStats.draws++;
      return drawArrays.apply(this, args);
    };
    const createProgram = WebGLRenderingContext.prototype.createProgram;
    WebGLRenderingContext.prototype.createProgram = function (...args) {
      if (this.canvas.hasAttribute("data-cloud-canvas")) window.cloudStats.programs++;
      return createProgram.apply(this, args);
    };
  });
});

async function sampleFrames(page) {
  return page.evaluate(() => new Promise((resolve) => {
    const start = performance.now();
    let previous = start;
    const intervals = [];
    const draws = window.cloudStats.draws;
    const longTasks = [];
    const observer = new PerformanceObserver((list) => longTasks.push(...list.getEntries().map((entry) => entry.duration)));
    observer.observe({ type: "longtask" });
    function sample(now) {
      intervals.push(now - previous);
      previous = now;
      if (now - start < 2500) { requestAnimationFrame(sample); return; }
      observer.disconnect();
      intervals.sort((a, b) => a - b);
      const seconds = (now - start) / 1000;
      resolve({
        fps: Number((intervals.length / seconds).toFixed(1)),
        p95FrameMs: Number(intervals[Math.floor(intervals.length * 0.95)].toFixed(1)),
        maxLongTaskMs: Number(Math.max(0, ...longTasks).toFixed(1)),
        shaderFps: Number(((window.cloudStats.draws - draws) / seconds).toFixed(1)),
      });
    }
    requestAnimationFrame(sample);
  }));
}

test("the sky is visibly painted outside the readable content surface", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.locator("canvas[data-cloud-canvas]")).toHaveAttribute("data-state", "running");
  await expect.poll(() => page.evaluate(() => window.cloudStats.draws)).toBeGreaterThan(5);
  const navigation = await page.getByRole("navigation", { name: "Үндсэн цэс", exact: true }).boundingBox();
  const screenshot = await page.screenshot({ path: testInfo.outputPath("background-visible.png"), animations: "disabled" });
  // Inspect the composited screenshot: a running canvas can still be covered by
  // the body or an opaque overlay, so WebGL status alone is not sufficient.
  const samples = await page.evaluate(async ({ png, startY }) => {
    const bytes = Uint8Array.from(atob(png), (character) => character.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes], { type: "image/png" }));
    const probe = document.createElement("canvas");
    probe.width = bitmap.width;
    probe.height = bitmap.height;
    const context = probe.getContext("2d");
    context.drawImage(bitmap, 0, 0);
    const ratio = bitmap.width / window.innerWidth;
    const colors = [];
    for (let y = startY; y < window.innerHeight - 20; y += 50) {
      for (const x of [4, window.innerWidth - 4]) {
        const [red, green, blue] = context.getImageData(Math.floor(x * ratio), Math.floor(y * ratio), 1, 1).data;
        colors.push({ red, green, blue });
      }
    }
    bitmap.close();
    return colors.filter(({ red, green, blue }) => blue - red > 25 && green > red).length;
  }, { png: screenshot.toString("base64"), startY: navigation.y + navigation.height + 20 });
  expect(samples, "Cloud sky should remain visible in both viewport margins").toBeGreaterThanOrEqual(2);
});

test("cloud rendering is bounded and navigation stays responsive", async ({ page, context }, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const canvas = page.locator("canvas[data-cloud-canvas]");
  await expect(canvas).toHaveAttribute("data-state", "running");
  await expect.poll(() => page.evaluate(() => window.cloudStats.draws)).toBeGreaterThan(5);
  const pixels = await canvas.evaluate((element) => element.width * element.height);
  expect(pixels).toBeLessThanOrEqual(450_000);

  const session = await context.newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const animated = await sampleFrames(page);
  expect(animated.shaderFps).toBeGreaterThan(0);
  expect(animated.shaderFps).toBeLessThanOrEqual(25);

  const clickedAt = Date.now();
  await page.getByRole("tab", { name: "Хадгалсан" }).click();
  await expect(page.getByRole("heading", { name: "Хадгалсан мэдээ алга байна" })).toBeVisible();
  const interactionMs = Date.now() - clickedAt;
  expect(interactionMs).toBeLessThan(1500);

  // A client route transition must keep the single background/context alive.
  await page.getByRole("navigation", { name: "Үндсэн цэс", exact: true }).getByRole("link", { name: "Нүүр", exact: true }).click();
  await page.getByRole("region", { name: "Онцлох мэдээнүүд" }).getByRole("link").first().click();
  await expect(page).toHaveURL(/\/article\/1$/);
  await expect(canvas).toHaveCount(1);
  expect(await page.evaluate(() => window.cloudStats.programs)).toBe(1);

  await canvas.evaluate((element) => {
    window.cloudContextExtension = element.getContext("webgl").getExtension("WEBGL_lose_context");
    window.cloudContextExtension.loseContext();
  });
  await expect(canvas).toHaveAttribute("data-state", "fallback");
  const fallback = await sampleFrames(page);
  expect(fallback.shaderFps).toBe(0);
  expect(animated.fps).toBeGreaterThanOrEqual(fallback.fps * 0.65);
  expect(animated.p95FrameMs).toBeLessThan(100);
  await page.evaluate(() => window.cloudContextExtension.restoreContext());
  await expect(canvas).toHaveAttribute("data-state", "running");
  expect(await page.evaluate(() => window.cloudStats.programs)).toBe(2);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await testInfo.attach("cloud-performance", { body: JSON.stringify({ viewport: testInfo.project.name, cpuThrottling: 4, pixels, animated, fallback, interactionMs }, null, 2), contentType: "application/json" });
  console.log(JSON.stringify({ viewport: testInfo.project.name, pixels, animated, fallback, interactionMs }));
  expect(errors).toEqual([]);
});

test("reduced motion and hidden tabs stop rendering, then resume", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.locator("canvas[data-cloud-canvas]");
  await expect(canvas).toHaveAttribute("data-state", "paused");
  await expect.poll(() => page.evaluate(() => window.cloudStats.draws)).toBeGreaterThan(0);
  await page.waitForTimeout(150);
  const pausedDraws = await page.evaluate(() => window.cloudStats.draws);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.cloudStats.draws)).toBe(pausedDraws);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(canvas).toHaveAttribute("data-state", "running");
  await expect.poll(() => page.evaluate(() => window.cloudStats.draws)).toBeGreaterThan(pausedDraws + 2);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => window.testHidden });
    window.testHidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-state", "paused");
  const hiddenDraws = await page.evaluate(() => window.cloudStats.draws);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.cloudStats.draws)).toBe(hiddenDraws);
  await page.evaluate(() => { window.testHidden = false; document.dispatchEvent(new Event("visibilitychange")); });
  await expect(canvas).toHaveAttribute("data-state", "running");
  await expect.poll(() => page.evaluate(() => window.cloudStats.draws)).toBeGreaterThan(hiddenDraws);
});

test("WebGL failures retain a usable background and working controls", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return getContext.call(this, type, ...args);
    };
  });
  await page.goto("/");
  const canvas = page.locator("canvas[data-cloud-canvas]");
  await expect(canvas).toHaveAttribute("data-state", "fallback");
  await expect(canvas).toHaveCSS("opacity", "0");
  expect(await canvas.evaluate((element) => getComputedStyle(element.parentElement).backgroundImage)).toContain("linear-gradient");
  await page.getByRole("tab", { name: "Хадгалсан" }).click();
  await expect(page.getByRole("heading", { name: "Хадгалсан мэдээ алга байна" })).toBeVisible();
  expect(await page.evaluate(() => window.cloudStats.draws)).toBe(0);
});
