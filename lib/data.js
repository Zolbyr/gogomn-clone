export const CATS = [
  { slug: "politics", name: "Улс төр", colors: ["#1d3557", "#457b9d"] },
  { slug: "society", name: "Нийгэм", colors: ["#2a6f5b", "#6fb79b"] },
  { slug: "economy", name: "Эдийн засаг", colors: ["#7a4b12", "#d9a441"] },
  { slug: "sports", name: "Спорт", colors: ["#b5301f", "#f08a5d"] },
  { slug: "showbiz", name: "Showbiz", colors: ["#6a1b6e", "#d36ab7"] },
  { slug: "world", name: "Дэлхий", colors: ["#14456b", "#4aa3c7"] },
  { slug: "tech", name: "Технологи", colors: ["#222a68", "#6d7bf0"] },
  { slug: "life", name: "Амьдрал", colors: ["#3d6b21", "#9acb5f"] },
];

export const ARTICLES = [
  { id: 1, cat: "politics", title: "УИХ-ын чуулган өнөөдөр хуулийн төслүүдийг хэлэлцэнэ", image: "https://picsum.photos/id/1015/800/500", time: "10 минутын өмнө", views: 8421, body: "Нэгдсэн хуралдаанаар хэд хэдэн хуулийн төслийг хэлэлцэхээр төлөвлөжээ." },
  { id: 2, cat: "society", title: "Улаанбаатарт цас орж, агаарын температур буурна", image: "https://picsum.photos/id/1016/800/500", time: "25 минутын өмнө", views: 12650, body: "Цаг уурынхан ойрын хоногт түр зуурын цас орохыг анхааруулж байна." },
  { id: 3, cat: "economy", title: "Экспортын орлого оны эхний есөн сард өслөө", image: "https://picsum.photos/id/1018/800/500", time: "1 цагийн өмнө", views: 5310, body: "Уул уурхайн бүтээгдэхүүний экспорт нэмэгдсэн нь тэнцэлд эерэг нөлөө үзүүлжээ." },
  { id: 4, cat: "sports", title: "Үндэсний шигшээ баг найз нөхдийн тоглолтод хожлоо", image: "https://picsum.photos/id/1019/800/500", time: "2 цагийн өмнө", views: 9874, body: "Баг хоёрдугаар таймд давуу байдал тогтоов." },
  { id: 5, cat: "tech", title: "Хиймэл оюун ухааны сургалт залуучуудад нээлттэй", image: "https://picsum.photos/id/1020/800/500", time: "3 цагийн өмнө", views: 7120, body: "Програмчлалын үндсийг заах үнэгүй сургалтад бүртгэл эхэллээ." },
  { id: 6, cat: "showbiz", title: "Дуучин шинэ цомгоо танилцууллаа", image: "https://picsum.photos/id/1021/800/500", time: "3 цагийн өмнө", views: 3302, body: "Цомогт арван нэгэн шинэ дуу багтсан байна." },
  { id: 7, cat: "world", title: "Олон улсын дээд хэмжээний уулзалт өнөөдөр эхэллээ", image: "https://picsum.photos/id/1022/800/500", time: "4 цагийн өмнө", views: 2845, body: "Оролцогч орнууд уур амьсгалын асуудлаар санал солилцоно." },
  { id: 8, cat: "life", title: "Өвлийн улиралд эрүүл мэндээ хамгаалах таван зөвлөгөө", image: "https://picsum.photos/id/1024/800/500", time: "5 цагийн өмнө", views: 11230, body: "Хангалттай нойр, зөв хооллолт, тогтмол дасгал дархлааг дэмждэг." },
  { id: 9, cat: "society", title: "Нийтийн тээвэрт шинэ цагийн хуваарь мөрдөнө", image: "https://picsum.photos/id/1025/800/500", time: "6 цагийн өмнө", views: 6540, body: "Ачаалал ихтэй цагт автобусны давтамжийг нэмэгдүүлнэ." },
  { id: 10, cat: "economy", title: "Банкууд зээлийн хүүгийн шинэ нөхцөл танилцууллаа", image: "https://picsum.photos/id/1027/800/500", time: "7 цагийн өмнө", views: 3890, body: "Жижиг дунд бизнест чиглэсэн шинэ бүтээгдэхүүнүүд санал болгож байна." },
];

export const getCat = (slug) => CATS.find((c) => c.slug === slug);
export const getArticle = (id) => ARTICLES.find((a) => a.id === Number(id));
export const byCat = (slug) => ARTICLES.filter((a) => a.cat === slug);
export const popular = (n = 6) => [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, n);
export const search = (q) => ARTICLES.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()));