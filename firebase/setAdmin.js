// firebase/setAdmin.js

import admin from "firebase-admin";
import { readFileSync } from "fs";

// serviceAccountKey.json を読み込み
const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

// Firebase Admin SDK 初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

/**
 * 管理者権限を付与する関数
 * @param {string} uid - Firebase Authentication の UID
 */
async function setAdminRole(uid) {
  try {
    await auth.setCustomUserClaims(uid, { admin: true });
    console.log(`✅ UID: ${uid} に管理者権限を付与しました`);
  } catch (error) {
    console.error("❌ 管理者権限付与エラー:", error);
  }
}

// 実行例（必要なときにUIDを指定して呼ぶ）
const uid = "ここに付与したいユーザーのUIDを入れる";
setAdminRole(uid);
