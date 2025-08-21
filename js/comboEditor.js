// js/comboEditor.js

import { db } from "../firebase/firebase-init.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// ===============================
// グローバル変数
// ===============================
let currentChar = null;
let moveListMap = {};
let rowCount = 0;

const comboArea = document.getElementById("combo-area");
const addRowBtn = document.getElementById("add-row-btn");
const saveLocalBtn = document.getElementById("save-local-btn");
const saveFirestoreBtn = document.getElementById("save-firestore-btn");
const charSelect = document.getElementById("char-select");

// ===============================
// キャラと技リストを登録
// ===============================
export function initCharacters(characters) {
  characters.forEach(c => {
    moveListMap[c] = ["5弱P","2弱P","5中P","5強P","SA1","SA2","SA3"];
  });

  // 特定キャラの専用技例
  moveListMap["サガット"] = ["5弱P","2弱P","5弱K","6弱K","2弱K",
  "5中P","6中P","2中P","5中K","2中K",
  "5強P","4強P","2強P","5強K","5強K(1段目)","6強K","2強K",
  "2中P2強P","2中P2強K","5中K5強K","5中P5強K",
  "弱タイガーショット","中タイガーショット","強タイガーショット","ODタイガーショット",
  "弱タイガーアパカ","中タイガーアパカ","強タイガーアパカ","溜めアパカ","ODタイガーアパカ",
  "弱タイガーニー","中タイガーニー","強タイガーニー","ODタイガーニー",
  "弱タイガーネクサス","中タイガーネクサス","強タイガーネクサス","ODタイガーネクサス",
  "弱派生","中派生","強派生",
  "SA1","SA2","SA3",
  "ドライブラッシュ","ドライブインパクト","投げ","ジャンプ","前ステップ",
  "J弱P","J中P","J強P","J弱K","J中K","J強K"];
moveListMap["リュウ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["AKI"] = ["5弱P","2弱P","5弱K","2弱K",
      "5中P","3中P","2中P","5中K","2中K",
      "5強P","6強P","2強P","5強K","6強K","2強K",
      "5弱P5弱P","5強P5強P",
      "弱紫煙砲","中紫煙泉","強紫煙撒","OD紫煙砲","OD紫煙追",
      "弱凶襲突","中凶襲突","強凶襲突","OD凶襲突",
      "弱蛇頭鞭","中蛇頭鞭","強蛇頭鞭","OD蛇頭鞭",
      "弱蛇軽功","中蛇軽功","強蛇軽功","OD蛇軽功",
      "猛毒牙","蛇連咬","雁字搦",
      "SA1","SA2","SA3",
      "ドライブラッシュ","ドライブインパクト","投げ","ジャンプ","前ステップ",
      "J弱P","J中P","J強P","J弱K","J中K","J強K"];
moveListMap["ルーク"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ジェイミー"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["マノン"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["キンバリー"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["マリーザ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["JP"] = ["5弱P","2弱P","5弱K","2弱K",
  "5中P","4中P","2中P","5中K","6中K","2中K",
  "5強P","2強P","3強P","5強K","6強K","2強K",
  "4中P5中P","5強P5強P","5強K5強K5強P","5強P5強P5強K",
  "弱トリグラフ","中トリグラフ","強トリグラフ","弱中トリグラフ","弱強トリグラフ","中強トリグラフ",
  "弱ストリボーグ","中ストリボーグ","強ストリボーグ","ODストリボーグ",
  "弱ヴィーハト","中ヴィーハト","強ヴィーハト","弱中ヴィーハト","弱強ヴィーハト","中強ヴィーハト",
  "弱ヴィーハトアクノ","中ヴィーハトアクノ","ヴィーハトチェーニ",
  "アムネジア","ODアムネジア",
  "弱トルバラン","中トルバラン","強トルバラン","ODトルバラン",
  "アブニマーチ","ODアブニマーチ",
  "SA1","SA2","SA3",
  "ドライブラッシュ","ドライブインパクト","投げ","微歩き","前ステップ",
  "J弱P","J中P","J強P","J弱K","J中K","J強K"];
moveListMap["キャミィ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["本田"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ブランカ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ガイル"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ケン"] = ["5弱P","2弱P","5弱K","2弱K",
      "5中P","6中P","2中P","5中K","2中K",
      "5強P","4強P","3強P","2強P","5強K","6強K","2強K","3強K",
      "弱気功拳","中気功拳","強気功拳","OD気功拳",
      "弱百裂脚","中百裂脚","強百裂脚","OD百裂脚",
      "弱スピニングバードキック","中スピニングバードキック","強スピニングバードキック","ODスピニングバードキック",
      "弱覇山蹴","中覇山蹴","強覇山蹴","OD覇山蹴",
      "弱天昇脚","中天昇脚","強天昇脚","OD天昇脚",
      "構え弱P","構え中P","構え強P","構え弱K","構え中K","構え強K",
      "SA1","SA2","SA3",
      "ドライブラッシュ","ドライブインパクト","投げ","ジャンプ","前ステップ",
      "J弱P","J中P","J強P","J強P(2段目)","J弱K","J中K","J2中K","J強K","垂直J強K"];
moveListMap["春麗"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ザンギエフ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ダルシム"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ラシード"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["エド"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["豪鬼"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ベガ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["テリー"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["舞"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["エレナ"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["ヴァイパー"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["アレックス"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];
moveListMap["イングリッド"] = ["5弱P", "2弱P", "波動拳", "昇龍拳", "竜巻旋風脚"];


  // セレクトボックスに追加
  characters.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    charSelect.appendChild(o);
  });

  currentChar = characters[0];
  loadLocal();
}

// ===============================
// 段追加
// ===============================
export function addRow(savedData=null) {
  rowCount++;
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("combo-row");

  // ヘッダー
  const header = document.createElement("div");
  header.classList.add("row-header");

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = savedData?.title || `コンボ${rowCount}`;
  titleInput.classList.add("row-title");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×段削除";
  deleteBtn.classList.add("row-delete-btn");
  deleteBtn.addEventListener("click", () => rowDiv.remove());

  const duplicateBtn = document.createElement("button");
  duplicateBtn.textContent = "複製";
  duplicateBtn.classList.add("row-duplicate-btn");
  duplicateBtn.addEventListener("click", () => duplicateRow(rowDiv));

  header.appendChild(titleInput);
  header.appendChild(deleteBtn);
  header.appendChild(duplicateBtn);

  // 技追加UI
  const controls = document.createElement("div");
  controls.classList.add("controls");
  const select = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "技を選択してください";
  select.appendChild(defaultOption);

  moveListMap[currentChar].forEach(move => {
    const o = document.createElement("option");
    o.value = move;
    o.textContent = move;
    select.appendChild(o);
  });

  const addBtn = document.createElement("button");
  addBtn.textContent = "追加";
  controls.appendChild(select);
  controls.appendChild(addBtn);

  const container = document.createElement("div");
  container.classList.add("image-container");

  addBtn.addEventListener("click", () => {
    const move = select.value;
    if (move) addImageBox(container, move);
  });

  if (savedData?.moves) savedData.moves.forEach(m => addImageBox(container, m));

  rowDiv.appendChild(header);
  rowDiv.appendChild(controls);
  rowDiv.appendChild(container);
  comboArea.appendChild(rowDiv);
}

// ===============================
// 複製
// ===============================
function duplicateRow(row) {
  const title = row.querySelector(".row-title").value + "_コピー";
  const moves = [...row.querySelectorAll(".image-box img")].map(img => img.alt);
  addRow({title, moves});
}

// ===============================
// 画像ボックス追加
// ===============================
function addImageBox(container, move) {
  const box = document.createElement("div");
  box.classList.add("image-box");

  const img = document.createElement("img");
  img.src = `images/${currentChar}/${move}.png`;
  img.alt = move;

  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => box.remove());

  box.appendChild(img);
  box.appendChild(delBtn);
  container.appendChild(box);
}

// ===============================
// ローカル保存/読み込み
// ===============================
function saveLocal() {
  const data = [];
  document.querySelectorAll(".combo-row").forEach(row => {
    const title = row.querySelector(".row-title").value;
    const moves = [...row.querySelectorAll(".image-box img")].map(img => img.alt);
    data.push({title, moves});
  });
  localStorage.setItem(`combo_${currentChar}`, JSON.stringify(data));
}

function loadLocal() {
  comboArea.innerHTML = "";
  rowCount = 0;
  const data = JSON.parse(localStorage.getItem(`combo_${currentChar}`) || "[]");
  data.forEach(d => addRow(d));
}

// ===============================
// Firestore保存
// ===============================
async function saveFirestore() {
  saveLocal();
  const data = JSON.parse(localStorage.getItem(`combo_${currentChar}`) || "[]");
  try {
    await setDoc(doc(db, "recommended", currentChar), { combos: data });
    alert("Firestoreに保存しました");
  } catch (e) {
    alert("保存失敗: " + e.message);
  }
}

// ===============================
// イベント登録
// ===============================
addRowBtn.addEventListener("click", () => addRow());
saveLocalBtn.addEventListener("click", () => {
  saveLocal();
  alert("ローカルに保存しました");
});
saveFirestoreBtn.addEventListener("click", saveFirestore);

charSelect.addEventListener("change", () => {
  saveLocal();
  currentChar = charSelect.value;
  loadLocal();
});
