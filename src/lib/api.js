// src/lib/api.js
// ── Pertemuan 13: Consume API ──────────────────────────────────
// Instance axios untuk konsumsi REST API Supabase pada schema "zeusgym".
// Supabase otomatis menyediakan REST API untuk setiap table:
//   https://<project-url>/rest/v1/<table-name>
//
// Header wajib:
//   - apikey         → API Key publishable Supabase
//   - Authorization  → Bearer <API Key>
//   - Accept-Profile  → nama schema (karena tabel kita ada di schema "zeusgym",
//                       bukan "public" yang jadi default Supabase)

import axios from "axios";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const api = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Accept-Profile": "zeusgym", // schema yang dipakai untuk GET
    "Content-Profile": "zeusgym", // schema yang dipakai untuk POST/PATCH/DELETE
    "Content-Type": "application/json",
  },
});

export default api;
