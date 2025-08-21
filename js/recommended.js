import { db } from "./firebase/firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// ====== DOM ======
const comboArea = document.getElementById("combo-area");

// URLからキャラ名取得（例: sagat_recommended.html → sagat）
const charName = location.pathname.split("/").pop().replace("_recommended.html","");

// ====== Firestoreからデータ取得 ======
async function loadRecommended() {
  try {
    const ref = doc(db, "recommended", charName);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      renderCombos(data.combos || []);
    } else {
      comboArea.innerHTML = "<p>おすすめコンボはまだ登録されていません。</p>";
    }
  } catch (err) {
    console.error(err);
    comboArea.innerHTML = "<p>データ読み込みエラー</p>";
  }
}

// ====== UI描画 ======
function renderCombos(combos) {
  comboArea.innerHTML = "";
  combos.forEach((c, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("combo-row");

    const header = document.createElement("div");
    header.classList.add("row-header");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = c.title || `コンボ${i+1}`;
    titleSpan.classList.add("row-title");

    header.appendChild(titleSpan);
    rowDiv.appendChild(header);

    const container = document.createElement("div");
    container.classList.add("image-container");

    (c.moves || []).forEach(move => {
      const box = document.createElement("div");
      box.classList.add("image-box");

      const img = document.createElement("img");
      img.src = `images/${charName}/${move}.png`;
      img.alt = move;

      box.appendChild(img);
      container.appendChild(box);
    });

    rowDiv.appendChild(container);
    comboArea.appendChild(rowDiv);
  });
}

// ====== 実行 ======
loadRecommended();
