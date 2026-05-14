// src/data/membersData.js
// Data 30 member gym — sesuai format Pertemuan 9
// kolom: id, name, code, plan (category), trainer (brand), price, visits (stock)

const membersData = [
  { id: 1,  name: "Andi Pratama",     code: "ZG-001", plan: "Gold",   trainer: "Coach Budi",   price: 500000, visits: 45, status: "Active",   joined: "2024-01-10", expiry: "2025-01-10", email: "andi@email.com",    phone: "081234567890" },
  { id: 2,  name: "Sari Dewi",        code: "ZG-002", plan: "Silver", trainer: "Coach Rina",   price: 300000, visits: 32, status: "Active",   joined: "2024-02-15", expiry: "2025-02-15", email: "sari@email.com",    phone: "081234567891" },
  { id: 3,  name: "Budi Santoso",     code: "ZG-003", plan: "Bronze", trainer: "Coach Deni",   price: 150000, visits: 18, status: "Expired",  joined: "2024-03-01", expiry: "2024-12-01", email: "budi@email.com",    phone: "081234567892" },
  { id: 4,  name: "Maya Lestari",     code: "ZG-004", plan: "Gold",   trainer: "Coach Budi",   price: 500000, visits: 67, status: "Active",   joined: "2024-04-20", expiry: "2025-04-20", email: "maya@email.com",    phone: "081234567893" },
  { id: 5,  name: "Reza Firmansyah",  code: "ZG-005", plan: "Silver", trainer: "Coach Rina",   price: 300000, visits: 29, status: "Active",   joined: "2024-05-12", expiry: "2025-05-12", email: "reza@email.com",    phone: "081234567894" },
  { id: 6,  name: "Dina Permata",     code: "ZG-006", plan: "Bronze", trainer: "Coach Deni",   price: 150000, visits: 12, status: "Expiring", joined: "2024-06-08", expiry: "2025-02-08", email: "dina@email.com",    phone: "081234567895" },
  { id: 7,  name: "Hendra Kurnia",    code: "ZG-007", plan: "Gold",   trainer: "Coach Yanto",  price: 500000, visits: 55, status: "Active",   joined: "2024-07-01", expiry: "2025-07-01", email: "hendra@email.com",  phone: "081234567896" },
  { id: 8,  name: "Fitri Nanda",      code: "ZG-008", plan: "Silver", trainer: "Coach Rina",   price: 300000, visits: 22, status: "Expiring", joined: "2024-08-15", expiry: "2025-02-15", email: "fitri@email.com",   phone: "081234567897" },
  { id: 9,  name: "Agus Setiawan",    code: "ZG-009", plan: "Bronze", trainer: "Coach Deni",   price: 150000, visits: 8,  status: "Active",   joined: "2024-09-01", expiry: "2025-09-01", email: "agus@email.com",    phone: "081234567898" },
  { id: 10, name: "Bella Oktavia",    code: "ZG-010", plan: "Gold",   trainer: "Coach Yanto",  price: 500000, visits: 71, status: "Active",   joined: "2024-09-15", expiry: "2025-09-15", email: "bella@email.com",   phone: "081234567899" },
  { id: 11, name: "Cahyo Nugroho",    code: "ZG-011", plan: "Silver", trainer: "Coach Budi",   price: 300000, visits: 19, status: "Active",   joined: "2024-10-01", expiry: "2025-10-01", email: "cahyo@email.com",   phone: "081234567800" },
  { id: 12, name: "Dewi Maharani",    code: "ZG-012", plan: "Bronze", trainer: "Coach Rina",   price: 150000, visits: 5,  status: "Expired",  joined: "2024-01-20", expiry: "2024-11-20", email: "dewi@email.com",    phone: "081234567801" },
  { id: 13, name: "Eko Prasetyo",     code: "ZG-013", plan: "Gold",   trainer: "Coach Yanto",  price: 500000, visits: 60, status: "Active",   joined: "2024-02-10", expiry: "2025-02-10", email: "eko@email.com",     phone: "081234567802" },
  { id: 14, name: "Fajar Ramadhan",   code: "ZG-014", plan: "Silver", trainer: "Coach Deni",   price: 300000, visits: 15, status: "Active",   joined: "2024-03-25", expiry: "2025-03-25", email: "fajar@email.com",   phone: "081234567803" },
  { id: 15, name: "Gita Purnama",     code: "ZG-015", plan: "Bronze", trainer: "Coach Rina",   price: 150000, visits: 10, status: "Active",   joined: "2024-04-05", expiry: "2025-04-05", email: "gita@email.com",    phone: "081234567804" },
  { id: 16, name: "Hadi Kusuma",      code: "ZG-016", plan: "Gold",   trainer: "Coach Budi",   price: 500000, visits: 83, status: "Active",   joined: "2024-04-18", expiry: "2025-04-18", email: "hadi@email.com",    phone: "081234567805" },
  { id: 17, name: "Irma Susanti",     code: "ZG-017", plan: "Silver", trainer: "Coach Yanto",  price: 300000, visits: 26, status: "Active",   joined: "2024-05-22", expiry: "2025-05-22", email: "irma@email.com",    phone: "081234567806" },
  { id: 18, name: "Joko Widodo",      code: "ZG-018", plan: "Bronze", trainer: "Coach Deni",   price: 150000, visits: 3,  status: "Expiring", joined: "2024-06-14", expiry: "2025-02-14", email: "joko@email.com",    phone: "081234567807" },
  { id: 19, name: "Kartini Rahayu",   code: "ZG-019", plan: "Gold",   trainer: "Coach Budi",   price: 500000, visits: 49, status: "Active",   joined: "2024-07-03", expiry: "2025-07-03", email: "kartini@email.com", phone: "081234567808" },
  { id: 20, name: "Lukman Hakim",     code: "ZG-020", plan: "Silver", trainer: "Coach Rina",   price: 300000, visits: 37, status: "Active",   joined: "2024-07-19", expiry: "2025-07-19", email: "lukman@email.com",  phone: "081234567809" },
  { id: 21, name: "Mira Handayani",   code: "ZG-021", plan: "Bronze", trainer: "Coach Deni",   price: 150000, visits: 7,  status: "Active",   joined: "2024-08-01", expiry: "2025-08-01", email: "mira@email.com",    phone: "081234567810" },
  { id: 22, name: "Nanda Saputra",    code: "ZG-022", plan: "Gold",   trainer: "Coach Yanto",  price: 500000, visits: 92, status: "Active",   joined: "2024-08-20", expiry: "2025-08-20", email: "nanda@email.com",   phone: "081234567811" },
  { id: 23, name: "Olivia Putri",     code: "ZG-023", plan: "Silver", trainer: "Coach Budi",   price: 300000, visits: 24, status: "Active",   joined: "2024-09-10", expiry: "2025-09-10", email: "olivia@email.com",  phone: "081234567812" },
  { id: 24, name: "Pandu Wijaya",     code: "ZG-024", plan: "Bronze", trainer: "Coach Rina",   price: 150000, visits: 14, status: "Expired",  joined: "2024-02-28", expiry: "2024-12-28", email: "pandu@email.com",   phone: "081234567813" },
  { id: 25, name: "Qori Amelia",      code: "ZG-025", plan: "Gold",   trainer: "Coach Yanto",  price: 500000, visits: 58, status: "Active",   joined: "2024-10-05", expiry: "2025-10-05", email: "qori@email.com",    phone: "081234567814" },
  { id: 26, name: "Rizky Maulana",    code: "ZG-026", plan: "Silver", trainer: "Coach Deni",   price: 300000, visits: 33, status: "Active",   joined: "2024-10-15", expiry: "2025-10-15", email: "rizky@email.com",   phone: "081234567815" },
  { id: 27, name: "Sinta Wulandari",  code: "ZG-027", plan: "Bronze", trainer: "Coach Rina",   price: 150000, visits: 9,  status: "Active",   joined: "2024-11-01", expiry: "2025-11-01", email: "sinta@email.com",   phone: "081234567816" },
  { id: 28, name: "Taufik Hidayat",   code: "ZG-028", plan: "Gold",   trainer: "Coach Budi",   price: 500000, visits: 76, status: "Active",   joined: "2024-11-12", expiry: "2025-11-12", email: "taufik@email.com",  phone: "081234567817" },
  { id: 29, name: "Umi Kalsum",       code: "ZG-029", plan: "Silver", trainer: "Coach Yanto",  price: 300000, visits: 41, status: "Active",   joined: "2024-12-01", expiry: "2025-12-01", email: "umi@email.com",     phone: "081234567818" },
  { id: 30, name: "Vino Pratama",     code: "ZG-030", plan: "Bronze", trainer: "Coach Deni",   price: 150000, visits: 6,  status: "Expiring", joined: "2024-12-15", expiry: "2025-02-15", email: "vino@email.com",    phone: "081234567819" },
];

export default membersData;