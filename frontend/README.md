# Teklif — Davet Uygulaması (Frontend)

React + Vite ile hazırlanmış, mock (sahte) veriyle çalışan frontend iskeleti.
Backend henüz yok; tüm veriler `src/mock/mockData.js` içinde tutuluyor ve
sayfa yenilenince (login hariç, çünkü giriş de mock) sıfırlanabilir.

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` açılır.

## Sayfalar

- `/` — Karşılama sayfası
- `/login`, `/register` — Owner giriş/üyelik (mock, herhangi bir kullanıcı adı+şifre ile girilebilir)
- `/dashboard` — Davet listesi, bildirim rozeti, yeni davet oluşturma
- `/invitations/new` — Yeni davet oluşturma formu (link üretir)
- `/invitations/:id` — Tamamlanmış davetin kartı
- `/i/:slug` — Alıcının göreceği davet akışı (wizard): karşılama → kaçan buton onayı →
  zaman dilimi → aktivite → tarih → final onay (yine kaçan buton) → teşekkür

Mock verideki hazır davetler:
- `/i/ah3f9x` (Ahmet) — zaten tamamlanmış, "zaten yanıtlandı" ekranını görürsün
- `/i/el7k2m` (Elif) — bekliyor, wizard akışını baştan deneyebilirsin

## Backend'e bağlanınca değişecek yerler

Her dosyada `// TODO: backend hazır olunca ...` yorumlarıyla işaretlendi:

- `src/context/AuthContext.jsx` — login/register gerçek API çağrısı + JWT saklama
- `src/pages/Login.jsx`, `Register.jsx` — POST /api/auth/login, /register
- `src/pages/NewInvitation.jsx` — POST /api/invitations
- `src/pages/Dashboard.jsx` — GET /api/invitations
- `src/pages/InvitationCard.jsx` — PATCH /api/invitations/{id}/seen
- `src/pages/InviteFlow.jsx` — GET /api/invite/{slug}, POST /api/invite/{slug}/respond
- `src/mock/mockData.js` — bu dosya tamamen kaldırılıp yerine gerçek API istekleri (örn. bir `api.js` / fetch katmanı) gelecek

## Tema

Pembe tonlar `src/index.css` içindeki CSS değişkenlerinde (`--pink-*`) tanımlı,
tek yerden değiştirilebilir.
