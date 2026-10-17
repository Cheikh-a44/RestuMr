/* ============================================================
   مذاق — بيانات توضيحية. عدّل المصفوفات أدناه أو اربطها بواجهة API.
   لإضافة صورة حقيقية ضع مسارها في الحقل img (مثال: "img/waha.jpg").
   ============================================================ */

const CITIES = [
  { name: "نواكشوط", count: "+120 مطعم",  tone: "gold"  },
  { name: "نواذيبو", count: "+45 مطعمًا", tone: "green" },
  { name: "أطار",    count: "+18 مطعمًا", tone: "clay"  },
  { name: "روصو",    count: "+22 مطعمًا", tone: "gold"  },
  { name: "كيفة",    count: "+14 مطعمًا", tone: "green" },
  { name: "النعمة",  count: "+9 مطاعم",   tone: "clay"  },
];

const RESTAURANTS = [
  { id: "waha",   name: "مطعم الواحة",  cuisine: "أرز بالسمك · مأكولات بحرية", city: "نواكشوط", rating: 4.8, time: "25–35 دقيقة", fee: 30, badge: "الأكثر طلبًا",  tone: "gold",  img: "" },
  { id: "shawa",  name: "بيت الشواء",   cuisine: "مشاوي ولحوم",                 city: "نواذيبو", rating: 4.6, time: "30–40 دقيقة", fee: 40, badge: "",              tone: "clay",  img: "" },
  { id: "sahra",  name: "ركن الصحراء",  cuisine: "أكلات تقليدية",               city: "أطار",    rating: 4.7, time: "35–45 دقيقة", fee: 0,  badge: "توصيل مجاني",   tone: "green", img: "", badgeTone: "green" },
  { id: "shinq",  name: "مطبخ شنقيط",   cuisine: "كسكس ومظرّب",                 city: "نواكشوط", rating: 4.5, time: "25–35 دقيقة", fee: 30, badge: "",              tone: "gold",  img: "" },
  { id: "muhit",  name: "دار المحيط",   cuisine: "سمك مشوي",                    city: "نواذيبو", rating: 4.9, time: "20–30 دقيقة", fee: 35, badge: "الأعلى تقييمًا", tone: "green", img: "" },
  { id: "nakhil", name: "مطعم النخيل",  cuisine: "وجبات سريعة",                 city: "روصو",    rating: 4.4, time: "30–40 دقيقة", fee: 25, badge: "",              tone: "clay",  img: "" },
];

const DISHES = [
  { id: 1, name: "أرز بالسمك",         restaurant: "مطعم الواحة", city: "نواكشوط", price: 120, tone: "gold",  img: "" },
  { id: 2, name: "لحم ضأن مشوي",       restaurant: "بيت الشواء",  city: "نواذيبو", price: 180, tone: "clay",  img: "" },
  { id: 3, name: "كسكس باللحم والخضار", restaurant: "مطبخ شنقيط",  city: "نواكشوط", price: 150, tone: "green", img: "" },
  { id: 4, name: "مظرّب",               restaurant: "ركن الصحراء", city: "أطار",    price: 160, tone: "gold",  img: "" },
  { id: 5, name: "دجاج مشوي",           restaurant: "مطعم النخيل", city: "روصو",    price: 200, tone: "clay",  img: "" },
  { id: 6, name: "سمك مشوي",            restaurant: "دار المحيط",  city: "نواذيبو", price: 170, tone: "green", img: "" },
  { id: 7, name: "شاي بالنعناع",        restaurant: "ركن الصحراء", city: "أطار",    price: 15,  tone: "gold",  img: "" },
  { id: 8, name: "زريق",                restaurant: "مطبخ شنقيط",  city: "نواكشوط", price: 25,  tone: "clay",  img: "" },
];

/* ---------- أدوات ---------- */
const $ = (s) => document.querySelector(s);

// تطبيع النص العربي ليصبح البحث متسامحًا مع التشكيل والهمزات
const normalize = (s) =>
  String(s).toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")   // التشكيل والتطويل
    .replace(/[إأآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const STAR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#E3A92B" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
const CLOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const PLUS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

const photo = (item, label) =>
  item.img
    ? `<img src="${esc(item.img)}" alt="${esc(item.name)}" loading="lazy">`
    : esc(label);

/* ---------- الحالة ---------- */
const state = { city: "", query: "", cart: 0 };

/* ---------- العرض ---------- */
function renderCities() {
  $("#citiesGrid").innerHTML = CITIES.map((c) => `
    <button type="button" class="card city" data-city="${esc(c.name)}" aria-pressed="${state.city === c.name}">
      <div class="ph ${c.tone}">صورة المدينة</div>
      <span class="city-body">
        <span class="city-name">${esc(c.name)}</span>
        <span class="city-count">${esc(c.count)}</span>
      </span>
    </button>`).join("");
}

function renderCitySelect() {
  $("#citySelect").innerHTML =
    `<option value="">كل المدن</option>` +
    CITIES.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");
}

function matches(text) {
  return !state.query || normalize(text).includes(normalize(state.query));
}

function renderRestaurants() {
  const list = RESTAURANTS.filter((r) =>
    (!state.city || r.city === state.city) &&
    matches(`${r.name} ${r.cuisine} ${r.city}`)
  );
  $("#restGrid").innerHTML = list.map((r) => `
    <article class="card rest">
      <div class="ph ${r.tone}">${photo(r, "صورة المطعم")}
        ${r.badge ? `<span class="badge ${r.badgeTone || ""}">${esc(r.badge)}</span>` : ""}
      </div>
      <div class="rest-body">
        <div class="row">
          <h3 class="rest-name">${esc(r.name)}</h3>
          <span class="rating">${STAR}${r.rating.toFixed(1)}</span>
        </div>
        <span class="sub">${esc(r.cuisine)} · ${esc(r.city)}</span>
        <div class="row meta">
          <span>${CLOCK}${esc(r.time)}</span>
          <span>${r.fee === 0 ? "توصيل مجاني" : `توصيل ${r.fee} أوقية`}</span>
        </div>
      </div>
    </article>`).join("");
  $("#restEmpty").hidden = list.length > 0;
  $("#restCount").textContent = list.length ? `${list.length} مطاعم` : "";
}

function renderDishes() {
  const list = DISHES.filter((d) =>
    (!state.city || d.city === state.city) &&
    matches(`${d.name} ${d.restaurant}`)
  );
  $("#dishGrid").innerHTML = list.map((d) => `
    <article class="card dish">
      <div class="ph ${d.tone}">${photo(d, "صورة الطبق")}</div>
      <div class="dish-body">
        <h3 class="dish-name">${esc(d.name)}</h3>
        <span class="sub">${esc(d.restaurant)}</span>
        <div class="dish-foot">
          <span class="price">${d.price} أوقية</span>
          <button type="button" class="add" data-id="${d.id}" aria-label="أضف ${esc(d.name)} إلى السلة">${PLUS}</button>
        </div>
      </div>
    </article>`).join("");
  $("#dishEmpty").hidden = list.length > 0;
  $("#dishCount").textContent = list.length ? `${list.length} أطباق` : "";
}

function renderAll() {
  renderCities();
  renderRestaurants();
  renderDishes();
  $("#citySelect").value = state.city;
}

/* ---------- الأحداث ---------- */
function setCity(name) {
  state.city = name;
  renderAll();
}

$("#citiesGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".city");
  if (!btn) return;
  const name = btn.dataset.city;
  setCity(state.city === name ? "" : name);          // الضغط مرة أخرى يلغي الفلتر
  document.getElementById("restaurants").scrollIntoView();
});

$("#clearCity").addEventListener("click", () => setCity(""));
$("#citySelect").addEventListener("change", (e) => setCity(e.target.value));

$("#searchInput").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderRestaurants();
  renderDishes();
});

$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("restaurants").scrollIntoView();
});

document.querySelectorAll(".chip[data-q]").forEach((chip) =>
  chip.addEventListener("click", () => {
    $("#searchInput").value = chip.dataset.q;
    state.query = chip.dataset.q;
    renderRestaurants();
    renderDishes();
    document.getElementById("dishes").scrollIntoView();
  })
);

$("#dishGrid").addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  state.cart += 1;
  $("#cartCount").textContent = state.cart;
  btn.classList.add("done");
  btn.innerHTML = CHECK;
  setTimeout(() => { btn.classList.remove("done"); btn.innerHTML = PLUS; }, 900);
});

/* تمييز الرابط النشط في القائمتين أثناء التمرير */
const links = document.querySelectorAll(".main-nav a, .bottom-nav a");
const sections = ["home", "cities", "restaurants", "dishes", "offers", "orders"]
  .map((id) => document.getElementById(id));
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach((s) => s && io.observe(s));

/* ---------- البدء ---------- */
renderCitySelect();
renderAll();
