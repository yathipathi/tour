# 🛕 South India Temple Tour Tracker — Yatra

A comprehensive pilgrimage management application for tracking your South India temple tour.

## 🌟 Features

- **Dashboard** — Live journey stats, current temple spotlight, today's schedule, weather widget
- **Route Map** — Visual route diagram across South India with all 10 temple stops
- **Temple Directory** — Detailed info: history, darshan timings, location, significance
- **12-Day Schedule** — Full itinerary with day-wise breakdown
- **Expense Tracker** — Add/view expenses by category (Fuel, Stay, Food, Darshan)
- **Weather Updates** — Forecast cards for all upcoming destinations
- **Analytics** — Journey progress, expense donut chart, daily distance bar chart, milestones
- **Emergency Services** — One-tap emergency numbers, nearby services, group tracker

## 🗺️ Pilgrimage Route

```
Hanmakonda → Thiruvananthapuram → Kanyakumari → Rameswaram →
Srivilliputhur → Srirangam → Thanjavur → Kumbakonam → Tirupati → Hanmakonda
```

Total Distance: ~2,720 km | 12 Days | 10 Sacred Temples

## 🚀 How to Run

Simply open `index.html` in any modern web browser. No build step required!

```bash
# Option 1: Direct open
open index.html

# Option 2: Local server (recommended)
npx serve .
# or
python3 -m http.server 8080
```

## 📁 Project Structure

```
temple-tour/
├── index.html          # Main HTML (all tabs)
├── styles/
│   └── main.css        # Complete styling
├── scripts/
│   └── main.js         # All functionality
├── src/
│   └── data/
│       └── temples.js  # Temple & expense data
└── README.md
```

## 🔌 Integration Points

The app is ready for real API integration:

- **Google Maps** — Replace map SVG with Google Maps embed using your API key
- **OpenWeather API** — Replace static weather data with live forecasts
- **Firebase** — Add authentication and real-time sync for group tracking
- **GPS/Geolocation** — Enable `navigator.geolocation` for live position

## 🎨 Design

- **Theme:** Deep navy blue temple aesthetic with gold accents
- **Font:** Cinzel Decorative (titles) + Crimson Pro (body)
- **Responsive:** Works on desktop, tablet, and mobile

## 🛕 States & Temples Covered

| Temple | State | Significance |
|--------|-------|--------------|
| Thousand Pillar Temple | Telangana | Kakatiya era, 1163 CE |
| Padmanabhaswamy | Kerala | 108 Divya Desams |
| Bhagavathy Amman | Tamil Nadu | Three seas confluence |
| Ramanathaswamy | Tamil Nadu | Char Dham, longest corridor |
| Andal Temple | Tamil Nadu | Tamil Nadu state symbol |
| Ranganathaswamy | Tamil Nadu | World's largest temple |
| Brihadeeswarar | Tamil Nadu | UNESCO World Heritage |
| Adi Kumbeswarar | Tamil Nadu | Temple city |
| Venkateswara | Andhra Pradesh | World's richest temple |
