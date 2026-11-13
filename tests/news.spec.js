const { test, expect } = require("@playwright/test");

test("featured articles, bookmarks and reading settings work", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Өнөөдрийн");
  await page.getByRole("region", { name: "Онцлох мэдээнүүд" }).getByRole("link").first().click();
  await expect(page).toHaveURL(/\/article\/1$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("УИХ-ын");

  await page.getByRole("button", { name: "Хадгалах", exact: true }).click();
  await expect(page.getByRole("button", { name: "Хадгалсан", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: "Хадгалсан", exact: true })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Текстийн хэмжээ", exact: true }).click();
  await page.getByRole("menuitemradio", { name: "Том", exact: true }).click();
  await expect(page.getByLabel("Мэдээний агуулга")).toHaveCSS("font-size", "22px");

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text) => { window.copiedArticleUrl = text; } } });
  });
  await page.getByRole("button", { name: "Холбоос хуулах", exact: true }).click();
  await expect(page.getByText("Мэдээний холбоосыг хууллаа", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.copiedArticleUrl)).toMatch(/\/article\/1$/);

  await page.goto("/#latest");
  await page.getByRole("tab", { name: "Хадгалсан" }).click();
  await expect(page.getByRole("tabpanel").getByRole("link")).toHaveCount(1);
  await page.getByRole("tabpanel").getByRole("link").click();
  await page.getByRole("button", { name: "Хадгалсан", exact: true }).click();
  await page.goto("/#latest");
  await page.getByRole("tab", { name: "Хадгалсан" }).click();
  await expect(page.getByText("Хадгалсан мэдээ алга байна", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("search handles matching, empty, repeated and missing queries", async ({ page }) => {
  await page.goto("/search?q=" + encodeURIComponent("Улаанбаатар"));
  await expect(page.getByRole("main").getByRole("link", { name: /Улаанбаатарт цас орж/ }).first()).toBeVisible();
  const field = page.getByRole("textbox", { name: "Хайх үг" });
  await field.fill("технологи");
  await page.getByRole("button", { name: "Хайх", exact: true }).click();
  await expect(page.getByRole("main").getByRole("link", { name: /Хиймэл оюун ухааны сургалт/ }).first()).toBeVisible();
  await page.goto("/search?q=unmatched-query-987");
  await expect(page.getByRole("heading", { name: "Тохирох мэдээ олдсонгүй" })).toBeVisible();
  await page.goto("/search?q=%20%20");
  await expect(page.getByRole("heading", { name: "Та юу сонирхож байна?" })).toBeVisible();
  await page.goto("/search?q=" + encodeURIComponent("Улаанбаатар") + "&q=other");
  await expect(page.getByRole("heading", { name: "“Улаанбаатар” хайлтын үр дүн" })).toBeVisible();
});

test("header search and category navigation work with keyboard or mobile menu", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Цэс болон хайлт нээх" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("textbox", { name: "Мэдээ хайх" }).fill("Улаанбаатар");
    await dialog.getByRole("button", { name: "Хайх", exact: true }).click();
    await expect(page).toHaveURL(/\/search\?q=/);
    await expect(dialog).not.toBeVisible();
    await page.getByRole("button", { name: "Цэс болон хайлт нээх" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Технологи", exact: true }).click();
  } else {
    await page.keyboard.press("Control+k");
    const search = page.getByRole("combobox", { name: "Мэдээ хайх" });
    await expect(search).toBeFocused();
    await search.fill("Улаанбаатар");
    await expect(page.getByRole("option").first()).toContainText("Улаанбаатарт");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/article\/2$/);
    await page.keyboard.press("Control+k");
    await search.fill("цас");
    await page.getByRole("button", { name: "Бүх үр дүнг үзэх" }).click();
    await expect(page).toHaveURL(/\/search\?q=/);
    await page.getByRole("navigation", { name: "Үндсэн цэс", exact: true }).getByRole("link", { name: "Технологи", exact: true }).click();
  }
  await expect(page).toHaveURL(/\/category\/tech$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Технологи");
  await expect(page.getByRole("navigation", { name: "Үндсэн цэс", exact: true }).getByRole("link", { name: "Технологи", exact: true })).toHaveAttribute("aria-current", "page");
});

test("routes fit the viewport, show missing pages and render screenshots", async ({ page }, testInfo) => {
  for (const route of ["/", "/article/1", "/category/economy", "/search?q=test"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, content: document.documentElement.scrollWidth }));
    expect(dimensions.content, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(dimensions.width);
    if (route === "/" || route === "/article/1") {
      await page.evaluate(async () => {
        const images = [...document.images];
        for (const image of images) image.loading = "eager";
        await Promise.all(images.map((image) => image.decode().catch(() => {})));
      });
      await page.screenshot({ path: testInfo.outputPath(route === "/" ? "home.png" : "article.png"), fullPage: true, animations: "disabled" });
    }
  }
  for (const route of ["/article/999", "/category/unknown"]) {
    const response = await page.goto(route);
    expect(response.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Хуудас олдсонгүй" })).toBeVisible();
  }
});
