import { firebaseConfig } from "./firebase-config.js";

// ---------- 画面要素 ----------
const $ = (id) => document.getElementById(id);
const screens = {
  config: $("screen-config"),
  setup: $("screen-setup"),
  main: $("screen-main"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 2200);
}

// ---------- Firebase設定チェック ----------
if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_")) {
  showScreen("config");
  throw new Error("firebase-config.js が未設定です。README.md を参照してください。");
}

const { initializeApp } = await import(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
);
const {
  getDatabase, ref, onValue, push, update, remove, serverTimestamp,
} = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------- ローカル設定 ----------
const store = {
  get listId() { return localStorage.getItem("kaimono.listId"); },
  set listId(v) { v ? localStorage.setItem("kaimono.listId", v) : localStorage.removeItem("kaimono.listId"); },
  get userName() { return localStorage.getItem("kaimono.userName"); },
  set userName(v) { v ? localStorage.setItem("kaimono.userName", v) : localStorage.removeItem("kaimono.userName"); },
};

// ---------- セットアップ ----------
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 紛らわしい文字(I,O,0,1)を除外
  let code = "";
  const rand = new Uint32Array(8);
  crypto.getRandomValues(rand);
  for (let i = 0; i < 8; i++) code += chars[rand[i] % chars.length];
  return code;
}

function normalizeCode(raw) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

$("btn-create").addEventListener("click", () => {
  $("input-code").value = generateCode();
  toast("新しいコードを作りました。このまま「はじめる」を押してください");
});

$("btn-join").addEventListener("click", () => {
  const name = $("input-name").value.trim();
  const code = normalizeCode($("input-code").value);
  if (!name) { toast("名前を入力してください"); return; }
  if (code.length < 6) { toast("リストコードを入力するか「新しく作る」を押してください"); return; }
  store.userName = name;
  store.listId = code;
  startApp();
});

// 招待リンク（?list=CODE）でコードを自動入力
const urlCode = normalizeCode(new URLSearchParams(location.search).get("list") || "");
if (urlCode) $("input-code").value = urlCode;

// ---------- メインアプリ ----------
let itemsRef = null;
let unsubscribe = null;
let currentItems = {};
let currentTab = "needed";

function startApp() {
  showScreen("main");
  $("settings-code").textContent = store.listId;
  $("settings-name").value = store.userName;

  itemsRef = ref(db, `lists/${store.listId}/items`);
  if (unsubscribe) unsubscribe();
  unsubscribe = onValue(itemsRef, (snap) => {
    currentItems = snap.val() || {};
    render();
  }, (err) => {
    console.error(err);
    toast("データの読み込みに失敗しました");
  });

  // 接続状態の表示
  onValue(ref(db, ".info/connected"), (snap) => {
    $("offline-banner").classList.toggle("hidden", snap.val() === true);
  });
}

// ---------- 描画 ----------
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const hm = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  if (sameDay) return `今日 ${hm}`;
  return `${d.getMonth() + 1}/${d.getDate()} ${hm}`;
}

function render() {
  const entries = Object.entries(currentItems);
  const needed = entries
    .filter(([, v]) => v.status === "needed")
    .sort((a, b) => (b[1].addedAt || 0) - (a[1].addedAt || 0));
  const bought = entries
    .filter(([, v]) => v.status === "bought")
    .sort((a, b) => (b[1].boughtAt || 0) - (a[1].boughtAt || 0))
    .slice(0, 50);

  $("count-needed").textContent = needed.length;

  $("list-needed").innerHTML = needed.map(([id, v]) => {
    const claimed = v.claimedBy
      ? `<div class="item-claim">🙋 ${escapeHtml(v.claimedBy)}が買いに行きます</div>`
      : "";
    const claimLabel = !v.claimedBy
      ? "🙋 私が買う！"
      : v.claimedBy === store.userName
        ? "やっぱりやめる"
        : "私が買うに変更";
    return `
      <li class="item" data-id="${id}">
        <div class="item-top">
          <div>
            <div class="item-name">${escapeHtml(v.name)}</div>
            <div class="item-meta">${escapeHtml(v.addedBy || "?")}が追加 ・ ${formatTime(v.addedAt)}</div>
          </div>
          <button class="btn-delete" data-action="delete" aria-label="削除">✕</button>
        </div>
        ${claimed}
        <div class="item-actions">
          <button class="btn btn-claim ${v.claimedBy === store.userName ? "active" : ""}" data-action="claim">${claimLabel}</button>
          <button class="btn btn-bought" data-action="bought">✅ 買った！</button>
        </div>
      </li>`;
  }).join("");

  $("list-history").innerHTML = bought.map(([id, v]) => `
    <li class="item history" data-id="${id}">
      <div class="item-top">
        <div>
          <div class="item-name">${escapeHtml(v.name)}</div>
          <div class="item-meta">${escapeHtml(v.boughtBy || "?")}が購入 ・ ${formatTime(v.boughtAt)}</div>
        </div>
        <button class="btn-delete" data-action="delete" aria-label="削除">✕</button>
      </div>
      <div class="item-actions">
        <button class="btn btn-readd" data-action="readd">🔄 また必要になった</button>
      </div>
    </li>`).join("");

  $("empty-needed").classList.toggle("hidden", !(currentTab === "needed" && needed.length === 0));
  $("empty-history").classList.toggle("hidden", !(currentTab === "history" && bought.length === 0));
}

// ---------- タブ ----------
function switchTab(tab) {
  currentTab = tab;
  $("tab-needed").classList.toggle("active", tab === "needed");
  $("tab-history").classList.toggle("active", tab === "history");
  $("list-needed").classList.toggle("hidden", tab !== "needed");
  $("list-history").classList.toggle("hidden", tab !== "history");
  render();
}
$("tab-needed").addEventListener("click", () => switchTab("needed"));
$("tab-history").addEventListener("click", () => switchTab("history"));

// ---------- アイテム操作 ----------
function neededNameExists(name) {
  const n = name.trim();
  return Object.values(currentItems).some(
    (v) => v.status === "needed" && v.name.trim() === n
  );
}

function addItem(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  if (neededNameExists(trimmed)) {
    toast(`「${trimmed}」はすでにリストにあります`);
    return;
  }
  push(itemsRef, {
    name: trimmed,
    status: "needed",
    addedBy: store.userName,
    addedAt: serverTimestamp(),
    claimedBy: null,
  });
}

$("btn-add").addEventListener("click", () => {
  addItem($("input-item").value);
  $("input-item").value = "";
  $("input-item").focus();
});

$("input-item").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addItem($("input-item").value);
    $("input-item").value = "";
  }
});

function handleItemAction(listEl) {
  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const li = btn.closest(".item");
    const id = li.dataset.id;
    const item = currentItems[id];
    if (!item) return;
    const itemRef = ref(db, `lists/${store.listId}/items/${id}`);

    switch (btn.dataset.action) {
      case "claim": {
        if (item.claimedBy === store.userName) {
          update(itemRef, { claimedBy: null });
        } else {
          update(itemRef, { claimedBy: store.userName });
        }
        break;
      }
      case "bought": {
        update(itemRef, {
          status: "bought",
          boughtBy: store.userName,
          boughtAt: serverTimestamp(),
          claimedBy: null,
        });
        toast(`「${item.name}」を購入済みにしました`);
        break;
      }
      case "readd": {
        if (neededNameExists(item.name)) {
          toast(`「${item.name}」はすでにリストにあります`);
          break;
        }
        update(itemRef, {
          status: "needed",
          addedBy: store.userName,
          addedAt: serverTimestamp(),
          claimedBy: null,
          boughtBy: null,
          boughtAt: null,
        });
        switchTab("needed");
        toast(`「${item.name}」をリストに戻しました`);
        break;
      }
      case "delete": {
        if (confirm(`「${item.name}」を削除しますか？`)) {
          remove(itemRef);
        }
        break;
      }
    }
  });
}
handleItemAction($("list-needed"));
handleItemAction($("list-history"));

// ---------- 設定モーダル ----------
$("btn-settings").addEventListener("click", () => $("modal-settings").classList.remove("hidden"));
$("btn-close-settings").addEventListener("click", () => $("modal-settings").classList.add("hidden"));
$("modal-settings").addEventListener("click", (e) => {
  if (e.target === $("modal-settings")) $("modal-settings").classList.add("hidden");
});

$("btn-copy-code").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(store.listId);
    toast("コードをコピーしました");
  } catch {
    toast(`コード: ${store.listId}`);
  }
});

$("btn-share").addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}?list=${store.listId}`;
  const text = `「かいものメモ」に招待します！\nリストコード: ${store.listId}\n${url}`;
  if (navigator.share) {
    try { await navigator.share({ title: "かいものメモ", text, url }); } catch { /* キャンセル */ }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      toast("招待メッセージをコピーしました");
    } catch {
      prompt("この内容をパートナーに送ってください", text);
    }
  }
});

$("btn-save-name").addEventListener("click", () => {
  const name = $("settings-name").value.trim();
  if (!name) { toast("名前を入力してください"); return; }
  store.userName = name;
  toast("名前を保存しました");
  render();
});

$("btn-leave").addEventListener("click", () => {
  if (!confirm("このリストから抜けますか？\n（リストのデータは消えません。コードを入れれば再参加できます）")) return;
  store.listId = null;
  $("modal-settings").classList.add("hidden");
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  currentItems = {};
  showScreen("setup");
});

// ---------- 起動 ----------
if (store.listId && store.userName) {
  startApp();
} else {
  showScreen("setup");
}

// ---------- Service Worker ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* 失敗しても動作に支障なし */ });
}
