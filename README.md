# Gogo clone

Gogo.mn сайтаас санаа авч хийсэн мэдээний порталын demo төсөл. Next.js, React, JavaScript болон TypeScript ашигласан.

## Ажиллуулах

Эхлээд Node.js суулгасан байна. Дараа нь төслийн хавтас дотроос:

```bash
npm install
npm run dev
```

Хөтөч дээр `http://localhost:3000` хаягаар нээнэ.

Dev сервер `.next-dev/`, production build `.next/` ашигладаг тул dev сервер ажиллаж байх үед build болон UI шалгалт хийхэд build файлууд давхар бичигдэхгүй.

Production хувилбарыг шалгахдаа:

```bash
npm run build
npm start
```

## Төслийн боломжууд

- Нүүр хуудас болон мэдээний ангиллаар үзэх
- Мэдээний дэлгэрэнгүйг нээх, мэдээ хайх
- Мэдээний карт болон жагсаалтад зураг харуулах
- Локал жишээ зураг, зураг ачаалагдахгүй үед орлуулах төлөв
- Гар утасны цэс, keyboard-оор удирдах хайлтын санал (Ctrl/⌘ + K)
- Шинэ, их уншсан, хадгалсан мэдээний tab
- Мэдээ хадгалах (энэ хөтчийн localStorage), холбоос хуулах, хуваалцах
- Унших үсгийн хэмжээ болон уншилтын явцын зурвас
- Ангилал, агуулга, гарчгаар хайх; хоосон үр дүн болон 404 хуудас

## UI компонентууд

### Монгол бичвэрийн найруулга

Цэс, товч, тайлбарыг богино, ойлгомжтой бичиж, холбоосын нэрийг очих хуудастай нь нийцүүлнэ.
«Хайх», «Хадгалах», «Хуваалцах», «Шинэ мэдээ» зэрэг нэр томьёог бүх хуудсанд ижил хэрэглэнэ.
Зөв бичлэгийг журамласан толиор, хэрэглээ ба найруулгыг Монгол сайтуудын жишээгээр нягтална.

Харьцуулсан жишээ:

- [Тэнгис](https://www.tengis.mn/): «Дэлгэрэнгүй» зэрэг товчийн үг хэллэг.
- [GoGo](https://gogo.mn/): мэдээний цэс, хайлт, унших хугацааны тэмдэглэгээ.
- [iKon](https://ikon.mn/): мэдээний гарчиг, ангиллын хэллэг.
- [Монгол хэлний зөв бичих дүрмийн журамласан толь](https://toli.gov.mn/): зөв бичлэгийн лавлагаа.

Нэмэлт харьцуулах эх сурвалж: [Өргөө](https://urgoo.mn/) болон бусад Монгол сайт.
Жишээ сонгохдоо тухайн хэллэгийн утга, хэрэглээ төслийнхтэй
нийцэж буй эсэхийг шалгана. Мэдээний агуулга нь сургалтын зориулалттай жишээ хэвээр байна.

### Ашигласан сангууд

Tailwind CSS v4, TypeScript болон React Server Components тохиргоотой shadcn/ui ашиглана. Cloud Shader болон demo нь `.tsx` файлтай; өмнөх JavaScript компонентууд `allowJs: true`, `checkJs: false` тохиргоогоор хамт ажиллана. `components.json`-д `tsx: true` тул цаашид CLI-ээр нэмэх компонентууд TypeScript байна. Одоо байгаа Next.js төсөлд `npx shadcn@latest init -d -b radix --no-monorepo` ажиллуулсан тул дахин шинэ төсөл үүсгэх шаардлагагүй.

- [shadcn/ui](https://ui.shadcn.com/docs/components): Button, Badge, Card, Input, Sheet, Tabs, Breadcrumb, Separator, Tooltip, Dropdown Menu, Sonner.
- [Magic UI](https://magicui.design/docs/components): Blur Fade болон Scroll Progress. Хөдөлгөөн багасгах системийн тохиргоог дэмжинэ.
- [Aceternity UI Cloud Shader](https://ui.aceternity.com/components/cloud-shader): бүх хуудасны зөөлөн үүлэн background. `npx shadcn@latest add @aceternity/cloud-shader` командаар суулгасан. Өнгө, хурд болон дүрслэлийн хязгаарыг `components/CloudBackground.js`-д тохируулна. 24 FPS, 450,000 пикселийн хязгаартай; далд tab болон reduced-motion үед давтан зураглахгүй. WebGL ажиллахгүй эсвэл context алдагдсан үед gradient дэвсгэр үлдэнэ.
- [Cloud Shader Demo registry](https://ui.aceternity.com/registry/cloud-shader-demo.json): `components/cloud-shader-demo.tsx`-д суулгаж background-тай холбосон. Registry нь нэмэлт npm dependency шаарддаггүй; TypeScript болон React/Node type dependency-уудыг dev dependency хэлбэрээр нэмсэн. Өмнө тохируулсан shader-ийн гүйцэтгэлийн хязгаарууд хадгалагдсан.
- [21st.dev / Kokonut UI](https://21st.dev/@kokonutd/components/action-search-bar): Action Search Bar-ийг мэдээний хайлттай холбож Монгол хэлээр тохируулсан. 21st.dev registry нь нэвтрэлт шаардсан тул зохиогчийн нээлттэй `https://kokonutui.com/r/action-search-bar.json` registry-ээс суулгасан.

Компонентын эх код төслийн дотор байрлана. Шинээр нэмэх жишээ:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add @magicui/blur-fade
npx shadcn@latest add @kokonutui/action-search-bar
npx shadcn@latest add @aceternity/cloud-shader
npx shadcn@latest add @aceternity/cloud-shader-demo
```

`components.json` registry болон `@/` alias-ийг, `app/globals.css` өнгө, зай, typography-ийг тохируулна. Magic UI / Kokonut UI-ийн суулгасан эх кодод хийсэн өөрчлөлтийг хадгалахын тулд дахин суулгахдаа overwrite хийх эсэхийг шалгаарай.

Demo компонентыг дангаар нь ашиглахад 40rem өндөртэй үүлэн дүрслэл гарна. Одоо байгаа `CloudBackground` нь өнгө, өндөр, хурдыг props-оор тохируулж ашигладаг:

```tsx
import CloudShaderDemo from "@/components/cloud-shader-demo";

export default function Example() {
  return <CloudShaderDemo />;
}
```

Next.js 15-тай нийцэх TypeScript 5.9 ашиглана. TypeScript шалгах: `npm run typecheck`. Тохиргоо нь `tsconfig.json`-д байрлана.

## UI шалгалт

Суусан Google Chrome ашиглан desktop болон mobile хэмжээнд шалгана:

```bash
npm run build
npm run test:ui -- --workers=1
```

Chrome байхгүй орчинд `npx playwright install chromium` ажиллуулаад `playwright.config.js` дэх `channel: "chrome"` тохиргоог хасна. Тестүүд хайлт, цэс, хадгалалт, үсгийн хэмжээ, 404 болон хуудас дэлгэцээс хальж байгаа эсэхийг шалгана. Screenshot болон алдааны trace нь Git-д орохгүй `test-results/` хавтаст хадгалагдана.

`tests/cloud-background.spec.js` нь desktop/mobile дээр 4× CPU удаашруулалттай кадрын хугацаа, UI үйлдлийн хариу, shader-ийн FPS/пикселийн хязгаар, reduced-motion, далд tab, WebGL fallback болон context сэргэхийг шалгана. Энэ нь Chrome-ийн хэмжилт ба төхөөрөмжийн эмуляци тул бодит гар утасны GPU-ийн хэмжилт биш.

## Фолдерын бүтэц

- `app/` - хуудас болон ерөнхий загварын CSS
- `components/` - хуудсуудад ашигладаг component-ууд
- `components/ui/` - shadcn/ui болон Magic UI-ийн компонентууд
- `components/kokonutui/` - 21st.dev дээр нийтлэгдсэн Kokonut UI хайлт
- `hooks/` - хадгалсан мэдээний tab хоорондын синхрончлол
- `public/images/` - сэдэвт тохирох локал жишээ зургууд, [эх сурвалжууд](public/images/SOURCES.md)
- `tests/` - Playwright UI шалгалтууд
- `lib/data.js` - demo мэдээ болон ангиллын мэдээлэл
- `next.config.mjs` - Next.js Image-д ашиглах гадаад зургийн домэйнууд

Энэ төсөл одоогоор demo өгөгдөл ашигладаг. Бодит мэдээний API эсвэл backend холбоогүй.
