// Remote logger / Debug panel for mobile/viewer troubleshooting
window.addEventListener('error', function(e) {
  let debugDiv = document.getElementById('debug-log-panel');
  if (!debugDiv) {
    debugDiv = document.createElement('div');
    debugDiv.id = 'debug-log-panel';
    debugDiv.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:150px;overflow-y:auto;background:rgba(255,0,0,0.9);color:#fff;font-family:monospace;font-size:11px;padding:10px;z-index:999999;border-top:2px solid #fff;pointer-events:none;';
    document.body.appendChild(debugDiv);
  }
  debugDiv.innerHTML += `<div>⚠️ Error: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}</div>`;
});

// ===== DATA =====
const temples = [
  { id: 1, name: "Hanmakonda", deity: "Thousand Pillar Temple", location: "Warangal, Telangana", lat: 17.9784, lng: 79.5941, darshan: "6:00 AM – 12:00 PM, 4:00 PM – 8:00 PM", significance: "Ancient Kakatiya-era temple dedicated to Shiva, Vishnu & Surya. Famous for its intricate star-shaped platform and ornate pillars dating to 1163 CE. The Swayambhu Linga here is considered extremely sacred.", distance: 0, visited: true, image: "🛕", color: "#FF6B35", tollTax: 0, nearbyFamous: ["Ramappa Temple (UNESCO)", "Warangal Fort", "Laknavaram Lake"], day: 1 },
  { id: 2, name: "Thiruvananthapuram", deity: "Padmanabhaswamy Temple", location: "Kerala", lat: 8.4855, lng: 76.9492, darshan: "3:30 AM – 12:00 PM, 5:00 PM – 8:20 PM", significance: "One of the 108 Divya Desams dedicated to Lord Vishnu in Anantha Shayana pose. Known for its legendary vault containing immeasurable treasure. Only Hindus are allowed entry; traditional dress mandatory.", distance: 1442, visited: false, image: "🏛️", color: "#F7931E", tollTax: 1450, nearbyFamous: ["Kovalam Beach", "Napier Museum", "Poovar Island"], day: 1 },
  { id: 3, name: "Kanyakumari", deity: "Bhagavathy Amman Temple", location: "Tamil Nadu", lat: 8.0883, lng: 77.5385, darshan: "4:30 AM – 12:30 PM, 4:00 PM – 8:00 PM", significance: "Southernmost tip of India where Arabian Sea, Bay of Bengal and Indian Ocean meet. The presiding deity Kumari Amman is worshipped as a virgin goddess. Witness spectacular sunrise and sunset over three seas.", distance: 1537, visited: false, image: "🌊", color: "#E91E8C", tollTax: 180, nearbyFamous: ["Vivekananda Rock Memorial", "Thiruvalluvar Statue", "Gandhi Memorial Mandapam"], day: 2 },
  { id: 4, name: "Rameswaram", deity: "Ramanathaswamy Temple", location: "Tamil Nadu", lat: 9.2881, lng: 79.3174, darshan: "5:00 AM – 1:00 PM, 3:00 PM – 9:00 PM", significance: "One of the Char Dham pilgrimage sites. Lord Rama is said to have worshipped Shiva here after Lanka war. Famous for 22 holy theerthams and 1,212m corridor — world's longest temple corridor.", distance: 1857, visited: false, image: "🌺", color: "#9C27B0", tollTax: 240, nearbyFamous: ["Dhanushkodi (Ghost Town)", "Pamban Bridge", "Dr. APJ Abdul Kalam Memorial"], day: 3 },
  { id: 5, name: "Srivilliputhur", deity: "Andal Temple", location: "Tamil Nadu", lat: 9.5097, lng: 77.6353, darshan: "6:00 AM – 12:00 PM, 4:00 PM – 9:00 PM", significance: "Birthplace of Andal, the only female Alvar saint. The magnificent 11-storey 59m gopuram is the official symbol of Tamil Nadu government. The goddess Andal is considered the only human incarnation who became one with Vishnu.", distance: 2077, visited: false, image: "🌸", color: "#4CAF50", tollTax: 150, nearbyFamous: ["Shenbaga Thoppu Squirrel Sanctuary", "Sathuragiri Hills", "Madurai Meenakshi Temple"], day: 4 },
  { id: 6, name: "Madurai", deity: "Meenakshi Amman Temple", location: "Tamil Nadu", lat: 9.9197, lng: 78.1198, darshan: "5:00 AM – 12:30 PM, 4:00 PM – 10:00 PM", significance: "Historic Hindu temple located on the southern bank of the Vaigai River. Dedicated to Thirukamakottam Meenakshi (a form of Parvati) and Sundareswarar (a form of Shiva). Famous for its 14 gopurams and the hall of 1000 pillars, it is a masterpiece of Dravidian architecture.", distance: 2157, visited: false, image: "🛕", color: "#00BCD4", tollTax: 120, nearbyFamous: ["Thirumalai Nayakkar Palace", "Koodal Azhagar Temple", "Gandhi Memorial Museum"], day: 4 },
  { id: 7, name: "Srirangam", deity: "Ranganathaswamy Temple", location: "Tamil Nadu", lat: 10.8641, lng: 78.6875, darshan: "6:00 AM – 1:00 PM, 3:15 PM – 9:00 PM", significance: "World's largest functioning Hindu temple complex spanning 156 acres with 21 gopurams and 39 pavilions. Dedicated to Lord Ranganatha (Vishnu) reclining on Adishesha serpent. A UNESCO tentative world heritage site.", distance: 2311, visited: false, image: "⛩️", color: "#2196F3", tollTax: 210, nearbyFamous: ["Jambukeswarar Temple, Thiruvanaikaval", "Rockfort Temple, Trichy", "Kallanai Dam"], day: 5 },
  { id: 8, name: "Thanjavur", deity: "Brihadeeswarar Temple", location: "Tamil Nadu", lat: 10.7829, lng: 79.1318, darshan: "6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM", significance: "UNESCO World Heritage Site built by Raja Raja Chola I in 1010 CE. The 66m vimana (tower) is one of India's tallest temple towers. Famous for Nandi carved from single rock and exceptional Chola bronze sculptures.", distance: 2372, visited: false, image: "🏯", color: "#FF5722", tollTax: 80, nearbyFamous: ["Thanjavur Royal Palace", "Saraswathi Mahal Library", "Schwartz Church"], day: 5 },
  { id: 9, name: "Kumbakonam", deity: "Adi Kumbeswarar & Sarangapani", location: "Tamil Nadu", lat: 10.9617, lng: 79.3882, darshan: "6:00 AM – 12:00 PM, 4:00 PM – 9:00 PM", significance: "Temple city with over 188 temples in a small area. The sacred Mahamaham tank hosts the Mahamaham festival every 12 years attracting millions of pilgrims. Home to some of the finest Chola and Vijayanagara architecture.", distance: 2414, visited: false, image: "🙏", color: "#795548", tollTax: 70, nearbyFamous: ["Darasuram Airavatesvara Temple", "Swamimalai Murugan Temple", "Oppiliappan Temple"], day: 6 },
  { id: 10, name: "Tirupati", deity: "Venkateswara Temple", location: "Andhra Pradesh", lat: 13.6288, lng: 79.4192, darshan: "2:30 AM – 1:30 AM (nearly 24 hrs)", significance: "Richest and most visited religious site on Earth receiving over 50,000–100,000 pilgrims daily. Lord Venkateswara (Balaji) is the presiding deity. The temple earns over ₹650 crore annually through donations and hair offerings.", distance: 2814, visited: false, image: "✨", color: "#FFC107", tollTax: 580, nearbyFamous: ["Sri Kalahasteeswara Temple", "Chandragiri Fort", "Talakona Waterfalls"], day: 7 },
  { id: 11, name: "Hanmakonda (Return)", deity: "Thousand Pillar Temple", location: "Warangal, Telangana", lat: 17.9784, lng: 79.5941, darshan: "6:00 AM – 12:00 PM, 4:00 PM – 8:00 PM", significance: "Return to starting point completing the sacred South India circuit. Total journey spans approximately 3,444 km across Telangana, Karnataka, Kerala, Tamil Nadu, and Andhra Pradesh covering some of India's most revered pilgrimage sites.", distance: 3444, visited: false, image: "🏠", color: "#607D8B", tollTax: 720, nearbyFamous: ["Kakatiya Musical Garden", "Bhadrakali Temple", "Padmakshi Temple"], day: 8 }
];

const expenses = [
  { id: 1, category: "Fuel", description: "Hanmakonda → Thiruvananthapuram via Bengaluru", amount: 6200, date: "2026-06-16", temple: "Thiruvananthapuram" },
  { id: 2, category: "Accommodation", description: "Hotel near Padmanabhaswamy Temple", amount: 1800, date: "2026-06-16", temple: "Thiruvananthapuram" },
  { id: 3, category: "Darshan", description: "Padmanabhaswamy special darshan", amount: 500, date: "2026-06-17", temple: "Thiruvananthapuram" },
  { id: 4, category: "Food", description: "Traditional Kerala meals & local coffee", amount: 850, date: "2026-06-17", temple: "Thiruvananthapuram" },
  { id: 5, category: "Fuel", description: "Drive Thiruvananthapuram to Kanyakumari", amount: 1200, date: "2026-06-17", temple: "Kanyakumari" },
  { id: 6, category: "Food", description: "Kanyakumari sunset restaurant dining", amount: 680, date: "2026-06-17", temple: "Kanyakumari" },
  { id: 7, category: "Fuel", description: "Kanyakumari → Rameswaram overnight drive", amount: 2800, date: "2026-06-17", temple: "Rameswaram" },
  { id: 8, category: "Accommodation", description: "Rameswaram seaside hotel stay", amount: 2200, date: "2026-06-18", temple: "Rameswaram" },
  { id: 9, category: "Darshan", description: "22 Holy Theerthams bath & darshan entry", amount: 600, date: "2026-06-18", temple: "Rameswaram" },
  { id: 10, category: "Food", description: "Rameswaram local dining meals", amount: 750, date: "2026-06-18", temple: "Rameswaram" }
];

const schedule = [
  { day: "Day 1", date: "June 16", temple: "Thiruvananthapuram", activity: "Hanmakonda to Thiruvananthapuram via Bengaluru (1442 km). Starting 4-5 AM." },
  { day: "Day 2", date: "June 17", temple: "Kanyakumari", activity: "Thiruvananthapuram Darshanam, local visits. Drive to Kanyakumari (95 km), Sunset. Night journey to Rameshwaram (320 km)." },
  { day: "Day 3", date: "June 18", temple: "Rameswaram", activity: "Total Day in Rameshwaram. Drive to Srivilliputhur (220 km) starting at 11:30 PM." },
  { day: "Day 4", date: "June 19", temple: "Srivilliputhur & Madurai", activity: "Morning Srivilliputhur Darshanam. Drive to Madurai (80 km) and local visits. Night journey Madurai to Srirangam (154 km)." },
  { day: "Day 5", date: "June 20", temple: "Srirangam & Thanjavur", activity: "Morning Srirangam Darshanam and Jaisakthi. Drive to Thanjavur (61 km) and then to Kumbakonam (42 km)." },
  { day: "Day 6", date: "June 21", temple: "Kumbakonam", activity: "Kumbakonam local visits. Night journey to Tirupati (400 km)." },
  { day: "Day 7", date: "June 22", temple: "Tirupati", activity: "Tirupati Venkateswara Darshanam (3 PM to 4 PM) and Departure." },
  { day: "Day 8", date: "June 23", temple: "Hanmakonda", activity: "Return journey to Hanmakonda/Hyderabad complete." }
];

const weatherData = [
  { name: "Hanmakonda", loc: "Telangana", icon: "☀️", temp: 34, desc: "Sunny · Dry Heat", humidity: 45, wind: "10 km/h", vis: "10 km", sea: "N/A" },
  { name: "Thiruvananthapuram", loc: "Kerala", icon: "⛅", temp: 31, desc: "Humid · Coastal breeze", humidity: 75, wind: "14 km/h", vis: "9 km", sea: "Calm" },
  { name: "Kanyakumari", loc: "Tamil Nadu", icon: "🌤️", temp: 30, desc: "Windy · Clear skies", humidity: 72, wind: "24 km/h", vis: "12 km", sea: "Rough" },
  { name: "Rameswaram", loc: "Tamil Nadu", icon: "⛅", temp: 32, desc: "Partly Cloudy · Coastal winds", humidity: 78, wind: "18 km/h", vis: "8 km", sea: "Moderate" },
  { name: "Srivilliputhur", loc: "Tamil Nadu", icon: "☀️", temp: 33, desc: "Sunny · Hot & dry", humidity: 65, wind: "12 km/h", vis: "10 km", sea: "N/A" },
  { name: "Madurai", loc: "Tamil Nadu", icon: "☀️", temp: 35, desc: "Sunny · Dry heat", humidity: 55, wind: "11 km/h", vis: "10 km", sea: "N/A" },
  { name: "Srirangam", loc: "Tamil Nadu", icon: "🌤️", temp: 31, desc: "Mostly clear", humidity: 70, wind: "14 km/h", vis: "9 km", sea: "N/A" },
  { name: "Thanjavur", loc: "Tamil Nadu", icon: "☀️", temp: 30, desc: "Clear sky", humidity: 68, wind: "10 km/h", vis: "12 km", sea: "N/A" },
  { name: "Kumbakonam", loc: "Tamil Nadu", icon: "⛅", temp: 29, desc: "Partly cloudy", humidity: 72, wind: "11 km/h", vis: "10 km", sea: "N/A" },
  { name: "Tirupati", loc: "Andhra Pradesh", icon: "🌧️", temp: 26, desc: "Light rain expected", humidity: 85, wind: "22 km/h", vis: "6 km", sea: "N/A" }
];

const svgPoints = [
  [300, 100],
  [100, 450],
  [110, 480],
  [200, 420],
  [160, 400],
  [180, 360],
  [210, 320],
  [230, 320],
  [250, 310],
  [250, 200],
  [300, 100]
];

// ===== STATE =====
let currentTab = 'dashboard';
let expenseList = [];
let editingExpenseIndex = null;

// ===== STORAGE ACTIONS =====
function saveTempleStates() {
  const states = temples.map(t => ({ id: t.id, visited: t.visited, current: t.current }));
  localStorage.setItem('yatra_temple_states', JSON.stringify(states));

  if (localStorage.getItem('yatra_app_role') !== 'family') {
    fetch('/api/temple-states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(states)
    }).catch(e => console.error("Error saving temple states to server", e));
  }
}

function applyTempleStates(states) {
  if (!Array.isArray(states)) return;
  states.forEach(s => {
    const temple = temples.find(t => t.id === s.id);
    if (temple) {
      temple.visited = s.visited;
      temple.current = s.current;
    }
  });
}

function loadTempleStates() {
  const stored = localStorage.getItem('yatra_temple_states');
  if (stored) {
    try {
      applyTempleStates(JSON.parse(stored));
    } catch (e) {}
  }

  fetch('/api/temple-states')
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        localStorage.setItem('yatra_temple_states', JSON.stringify(data));
        applyTempleStates(data);
        renderRouteTimeline();
        renderTemples();
        updateDashboardStats();
      } else {
        if (localStorage.getItem('yatra_app_role') !== 'family') {
          saveTempleStates();
        }
      }
    })
    .catch(e => console.error("Error loading temple states from server", e));
}

function loadExpenses() {
  const stored = localStorage.getItem('yatra_expenses');
  if (stored) {
    try {
      expenseList = JSON.parse(stored);
      if (!Array.isArray(expenseList)) {
        expenseList = [...expenses];
      } else {
        expenseList = expenseList.filter(e => e && typeof e === 'object');
      }
    } catch (e) {
      expenseList = [...expenses];
    }
  } else {
    expenseList = [...expenses];
    localStorage.setItem('yatra_expenses', JSON.stringify(expenseList));
  }

  fetch('/api/expenses')
    .then(res => res.json())
    .then(data => {
      if (data && Array.isArray(data)) {
        const cleanedData = data.filter(e => e && typeof e === 'object');
        if (cleanedData.length > 0) {
          localStorage.setItem('yatra_expenses', JSON.stringify(cleanedData));
          expenseList = cleanedData;
          renderExpenses();
          updateDashboardStats();
        } else {
          if (localStorage.getItem('yatra_app_role') !== 'family') {
            fetch('/api/expenses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(expenseList)
            }).catch(e => console.error("Error pushing expenses to server", e));
          } else {
            localStorage.setItem('yatra_expenses', JSON.stringify([]));
            expenseList = [];
            renderExpenses();
            updateDashboardStats();
          }
        }
      }
    })
    .catch(e => console.error("Error loading expenses from server", e));
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadTempleStates();
  loadExpenses();
  initPasskeySystem();
  initDate();
  initNavigation();
  renderRouteTimeline();
  renderTemples();
  renderSchedule();
  renderExpenses();
  renderWeather();
  renderBarChart();
  initMobileNav();
  initFamilyShareAndTracking();
  updateDashboardStats();
  window.fetchAndRenderStops();

  // Register Service Worker for PWA support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log("Service Worker registered successfully"))
      .catch(err => console.error("Service Worker registration failed:", err));
  }

  // Load initial location for both driver and family modes on startup
  fetch('/api/location')
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("No location");
    })
    .then(data => {
      updateViewerUI(data);
    })
    .catch(e => {
      const stored = localStorage.getItem('yatra_live_location');
      if (stored) {
        try {
          updateViewerUI(JSON.parse(stored));
        } catch (err) {}
      }
    });

  initPwaInstallPrompt();
});

let deferredPrompt = null;

function initPwaInstallPrompt() {
  const modal = document.getElementById('pwaInstallModal');
  const androidView = document.getElementById('pwaAndroidView');
  const iosView = document.getElementById('pwaiOSView');
  const androidManualView = document.getElementById('pwaAndroidManualView');
  const installBtn = document.getElementById('btn-pwa-install-action');
  const dismissBtn = document.getElementById('btn-pwa-install-dismiss');
  const btnShortcutGps = document.getElementById('btn-pwa-install-shortcut');
  const btnShortcutSidebar = document.getElementById('sidebar-pwa-install-shortcut');

  if (!modal) return;

  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isInstalled) {
    if (btnShortcutGps) btnShortcutGps.style.display = 'none';
    if (btnShortcutSidebar) btnShortcutSidebar.style.display = 'none';
    console.log("App is running in standalone installed mode.");
    return;
  } else {
    if (btnShortcutGps) btnShortcutGps.style.display = 'block';
    if (btnShortcutSidebar) btnShortcutSidebar.style.display = 'flex';
  }

  // Developer mode bypass: Allow forcing the modal to show using ?test-pwa=true in URL
  const params = new URLSearchParams(window.location.search);
  const isTestingPWA = params.get('test-pwa') === 'true' || params.get('pwa-test') === 'true';

  if (!isTestingPWA) {
    // If user already dismissed it, do not show auto-popup (but shortcuts remain available)
    if (localStorage.getItem('pwa_install_prompt_dismissed') === 'true') {
      return;
    }
  }

  // Sniff platforms
  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid || window.innerWidth <= 800;

  // Handle Chrome/Android beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default browser mini-infobar prompt
    e.preventDefault();
    // Save the event for triggering later
    deferredPrompt = e;
    
    // Show the custom one-click install button for Android/Chrome
    if (androidView) androidView.style.display = 'block';
    if (androidManualView) androidManualView.style.display = 'none';
    if (iosView) iosView.style.display = 'none';
    modal.style.display = 'flex';
  });

  // Display manual fallback instructions after a short delay (2 seconds)
  // if beforeinstallprompt event is not supported or hasn't fired.
  // This ensures mobile test sessions on insecure HTTP local hosts can still see and install the PWA.
  setTimeout(() => {
    // Double check state if not in testing override mode
    if (!isTestingPWA) {
      const stillInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      const dismissed = localStorage.getItem('pwa_install_prompt_dismissed') === 'true';
      if (stillInstalled || dismissed) return;
    }

    if (isIOS) {
      if (androidView) androidView.style.display = 'none';
      if (androidManualView) androidManualView.style.display = 'none';
      if (iosView) iosView.style.display = 'block';
      modal.style.display = 'flex';
    } else if (isAndroid || isMobile || isTestingPWA) {
      // If native PWA install prompt is not available, show manual steps for Chrome
      if (!deferredPrompt) {
        if (androidView) androidView.style.display = 'none';
        if (androidManualView) androidManualView.style.display = 'block';
        if (iosView) iosView.style.display = 'none';
        modal.style.display = 'flex';
      }
    }
  }, 2000);

  // Set up click handlers
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show the browser prompt
        deferredPrompt.prompt();
        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA install prompt choice: ${outcome}`);
        if (outcome === 'accepted') {
          localStorage.setItem('pwa_install_prompt_dismissed', 'true');
        }
        deferredPrompt = null;
        modal.style.display = 'none';
      }
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      localStorage.setItem('pwa_install_prompt_dismissed', 'true');
      modal.style.display = 'none';
    });
  }
}

// Global function to show PWA Install modal with contextual instruction content
window.showPwaInstallModal = function() {
  // If native installation is ready, trigger it directly without opening modal instructions!
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(`PWA install prompt choice: ${choiceResult.outcome}`);
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('pwa_install_prompt_dismissed', 'true');
        // Hide shortcut buttons
        const btnShortcutGps = document.getElementById('btn-pwa-install-shortcut');
        const btnShortcutSidebar = document.getElementById('sidebar-pwa-install-shortcut');
        if (btnShortcutGps) btnShortcutGps.style.display = 'none';
        if (btnShortcutSidebar) btnShortcutSidebar.style.display = 'none';
      }
      deferredPrompt = null;
    }).catch(err => {
      console.error("Error during PWA installation choice prompt:", err);
    });
    return;
  }

  const modal = document.getElementById('pwaInstallModal');
  const androidView = document.getElementById('pwaAndroidView');
  const iosView = document.getElementById('pwaiOSView');
  const androidManualView = document.getElementById('pwaAndroidManualView');

  if (!modal) return;

  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid || window.innerWidth <= 800;

  if (isIOS) {
    if (androidView) androidView.style.display = 'none';
    if (androidManualView) androidManualView.style.display = 'none';
    if (iosView) iosView.style.display = 'block';
  } else if (isAndroid || isMobile) {
    if (androidView) androidView.style.display = 'none';
    if (androidManualView) androidManualView.style.display = 'block';
    if (iosView) iosView.style.display = 'none';
  } else {
    // Desktop Chrome/Edge/Firefox fallback if native prompt is somehow missing
    if (androidView) androidView.style.display = 'none';
    if (androidManualView) androidManualView.style.display = 'block';
    if (iosView) iosView.style.display = 'none';
  }

  modal.style.display = 'flex';
};

function updateDashboardStats() {
  // Clean expenseList to prevent crashes on null/undefined elements
  expenseList = (expenseList || []).filter(e => e && typeof e === 'object');

  const currentTemple = temples.find(t => t.current) || temples[0];
  const visitedCount = temples.filter(t => t.visited && t.id < 11).length;
  
  // Calculate day based on currentTemple
  const day = currentTemple.day || 1;

  const totalExpenses = expenseList.reduce((sum, e) => sum + e.amount, 0);

  // 1. Stats Cards
  const distValEl = document.getElementById('stat-dist-val');
  const distFillEl = document.getElementById('stat-dist-fill');
  if (distValEl) distValEl.textContent = `${currentTemple.distance.toLocaleString()} km`;
  if (distFillEl) {
    const distPct = Math.round((currentTemple.distance / 3444) * 100);
    distFillEl.style.width = `${distPct}%`;
  }

  const visitedValEl = document.getElementById('stat-visited-val');
  const visitedFillEl = document.getElementById('stat-visited-fill');
  if (visitedValEl) visitedValEl.textContent = `${visitedCount} / 10`;
  if (visitedFillEl) {
    const visitedPct = Math.round((visitedCount / 10) * 100);
    visitedFillEl.style.width = `${visitedPct}%`;
  }

  const daysValEl = document.getElementById('stat-days-val');
  const daysFillEl = document.getElementById('stat-days-fill');
  if (daysValEl) daysValEl.textContent = `${day} Days`;
  if (daysFillEl) {
    const daysPct = Math.round((day / 8) * 100);
    daysFillEl.style.width = `${daysPct}%`;
  }

  const expensesValEl = document.getElementById('stat-expenses-val');
  const expensesFillEl = document.getElementById('stat-expenses-fill');
  if (expensesValEl) expensesValEl.textContent = `₹${totalExpenses.toLocaleString()}`;
  if (expensesFillEl) {
    const expPct = Math.min(100, Math.round((totalExpenses / 25000) * 100));
    expensesFillEl.style.width = `${expPct}%`;
  }

  // 2. Header Badge
  const headerLocBadge = document.getElementById('current-location-badge-text');
  if (headerLocBadge) headerLocBadge.textContent = `📍 Currently: ${currentTemple.name}`;

  // 3. Current Destination Spotlight
  const spotlightEmoji = document.querySelector('.current-temple-card .temple-emoji');
  const spotlightName = document.querySelector('.current-temple-card .temple-name');
  const spotlightLoc = document.querySelector('.current-temple-card .temple-location');
  const spotlightDesc = document.querySelector('.current-temple-card .temple-desc-mini');
  const spotlightDetails = document.querySelector('.current-temple-card .temple-details-mini');

  if (spotlightEmoji) spotlightEmoji.textContent = currentTemple.image;
  if (spotlightName) spotlightName.textContent = currentTemple.name === "Hanmakonda (Return)" ? "Hanmakonda (Return)" : currentTemple.deity;
  if (spotlightLoc) spotlightLoc.textContent = `📍 ${currentTemple.location}`;
  if (spotlightDesc) spotlightDesc.textContent = currentTemple.significance;
  if (spotlightDetails) {
    const isStart = currentTemple.id === 1;
    const isReturn = currentTemple.id === 11;
    let chipsHtml = `
      <div class="detail-chip">⏰ ${currentTemple.darshan.split(',')[0]}</div>
      <div class="detail-chip">🛕 ${currentTemple.deity}</div>
    `;
    if (isStart) {
      chipsHtml += `<div class="detail-chip">🚩 Starting Point</div>`;
    } else if (isReturn) {
      chipsHtml += `<div class="detail-chip">🏁 Return Point</div>`;
    } else {
      chipsHtml += `<div class="detail-chip">🛣️ Toll Tax: ₹${currentTemple.tollTax}</div>`;
    }
    spotlightDetails.innerHTML = chipsHtml;
  }

  // 4. Today's Schedule Card
  const scheduleCardHeaderBadge = document.querySelector('.today-schedule')?.previousElementSibling?.querySelector('span.badge');
  if (scheduleCardHeaderBadge) scheduleCardHeaderBadge.textContent = `Day ${day}`;

  const scheduleItem = schedule.find(s => s.day === `Day ${day}`) || { activity: "Leisure / Travel Day" };
  const todayScheduleContainer = document.querySelector('.today-schedule');
  if (todayScheduleContainer) {
    todayScheduleContainer.innerHTML = `
      <div class="schedule-item">
        <div class="time-block">06:00 AM</div>
        <div class="sch-detail">
          <div class="sch-title">Morning Prayers & Prep</div>
          <div class="sch-sub">Start of Day ${day}</div>
        </div>
        <div class="sch-status done">✓</div>
      </div>
      <div class="schedule-item active-sch">
        <div class="time-block">09:00 AM</div>
        <div class="sch-detail">
          <div class="sch-title">${scheduleItem.activity}</div>
          <div class="sch-sub">${currentTemple.name}</div>
        </div>
        <div class="sch-status current">▶</div>
      </div>
      <div class="schedule-item">
        <div class="time-block">01:00 PM</div>
        <div class="sch-detail">
          <div class="sch-title">Lunch & Local exploration</div>
          <div class="sch-sub">Nearby areas</div>
        </div>
        <div class="sch-status pending">○</div>
      </div>
      <div class="schedule-item">
        <div class="time-block">06:00 PM</div>
        <div class="sch-detail">
          <div class="sch-title">Evening Aarti & Rest</div>
          <div class="sch-sub">Hotel / Temple compound</div>
        </div>
        <div class="sch-status pending">○</div>
      </div>
    `;
  }

  // 5. Weather Widget on Dashboard
  const weatherHeaderSpan = document.querySelector('.weather-card .card-header span');
  const weatherIcon = document.querySelector('.weather-card .weather-icon-big');
  const weatherTemp = document.querySelector('.weather-card .weather-temp');
  const weatherDesc = document.querySelector('.weather-card .weather-desc');
  const weatherRow = document.querySelector('.weather-card .weather-row');
  const forecastRow = document.querySelector('.weather-card .forecast-row');

  if (weatherHeaderSpan) weatherHeaderSpan.textContent = currentTemple.name;
  
  // Fetch live weather data asynchronously
  fetchLiveWeather(currentTemple.lat, currentTemple.lng, currentTemple.name).then(liveWeather => {
    // Make sure destination hasn't changed during fetch
    const nowActiveTemple = temples.find(t => t.current) || temples[0];
    if (nowActiveTemple.name !== currentTemple.name) return;

    if (weatherIcon) weatherIcon.textContent = liveWeather.icon;
    if (weatherTemp) weatherTemp.textContent = `${liveWeather.temp}°C`;
    if (weatherDesc) weatherDesc.textContent = liveWeather.desc;
    if (weatherRow) {
      weatherRow.innerHTML = `
        <div class="weather-item"><span>💧</span><span>${liveWeather.humidity}%</span><span>Humidity</span></div>
        <div class="weather-item"><span>💨</span><span>${liveWeather.wind}</span><span>Wind</span></div>
        <div class="weather-item"><span>👁️</span><span>${liveWeather.vis}</span><span>Visibility</span></div>
        <div class="weather-item"><span>🌊</span><span>${liveWeather.sea}</span><span>Sea</span></div>
      `;
    }
    if (forecastRow && liveWeather.forecast) {
      forecastRow.innerHTML = liveWeather.forecast.map(f => `
        <div class="forecast-day">
          <div>${f.day}</div>
          <div>${f.icon}</div>
          <div>${f.temp}°</div>
        </div>
      `).join('');
    }
  });

  // 6. Next Destination Card
  const currentIdx = temples.findIndex(t => t.current);
  const nextTemple = currentIdx !== -1 && currentIdx < temples.length - 1 ? temples[currentIdx + 1] : null;

  const nextIcon = document.querySelector('.next-temple .next-icon');
  const nextTitle = document.querySelector('.next-temple .next-info h4');
  const nextDesc = document.querySelector('.next-temple .next-info p');
  const nextChip = document.querySelector('.next-temple .next-info .route-chip');
  const nextBtn = document.querySelector('.next-temple button');

  if (nextTemple) {
    const nextDist = nextTemple.distance - currentTemple.distance;
    const nextHrs = Math.max(1, Math.round(nextDist / 55));
    
    if (nextIcon) nextIcon.textContent = nextTemple.image;
    if (nextTitle) nextTitle.textContent = `${nextTemple.deity}, ${nextTemple.name}`;
    if (nextDesc) nextDesc.textContent = `~${nextDist} km away · ~${nextHrs} hrs drive`;
    if (nextChip) nextChip.textContent = `Via NH ${nextTemple.tollTax > 150 ? '44' : '38'} Route`;
    if (nextBtn) {
      nextBtn.style.display = 'block';
      nextBtn.onclick = () => window.open(`https://www.google.com/maps/search/?api=1&query=${nextTemple.lat},${nextTemple.lng}`, '_blank');
    }
  } else {
    if (nextIcon) nextIcon.textContent = "🎉";
    if (nextTitle) nextTitle.textContent = "YOUNG BOYS Completed!";
    if (nextDesc) nextDesc.textContent = "All sacred destinations and return completed successfully!";
    if (nextChip) nextChip.textContent = "Circuit Complete";
    if (nextBtn) nextBtn.style.display = 'none';
  }

  // 7. Fuel Estimation Card
  const remainingDist = Math.max(0, 3444 - currentTemple.distance);
  const fuelNeeded = Math.round(remainingDist / 12);
  const fuelCostEst = Math.round(fuelNeeded * 102.50);
  const nextFuelStop = nextTemple ? `${nextTemple.name} Area` : "Completed";

  const fuelGrid = document.querySelector('.fuel-grid');
  if (fuelGrid) {
    fuelGrid.innerHTML = `
      <div class="fuel-item"><span class="fuel-label">Remaining Route</span><span class="fuel-val">${remainingDist.toLocaleString()} km</span></div>
      <div class="fuel-item"><span class="fuel-label">Est. Fuel Needed</span><span class="fuel-val">~${fuelNeeded} L</span></div>
      <div class="fuel-item"><span class="fuel-label">Fuel Cost Est.</span><span class="fuel-val">₹${fuelCostEst.toLocaleString()}</span></div>
      <div class="fuel-item"><span class="fuel-label">Next Fuel Stop</span><span class="fuel-val">${nextFuelStop}</span></div>
    `;
  }

  // 8. Journey Progress Complete Badge
  const journeyCompletePct = Math.round((currentTemple.distance / 3444) * 100);
  const journeyProgressBadge = document.querySelector('.journey-card .badge');
  if (journeyProgressBadge) journeyProgressBadge.textContent = `${journeyCompletePct}% Complete`;

  // 9. Analytics Tab Overview
  const anVals = document.querySelectorAll('.analytics-stats .an-val');
  if (anVals.length >= 4) {
    anVals[0].textContent = `${journeyCompletePct}%`;
    anVals[1].textContent = `${visitedCount} / 10`;
    anVals[2].textContent = `${day}`;
    anVals[3].textContent = `${8 - day}`;
  }
  const analyticsProgressText = document.querySelector('.progress-bar-full .pb-label span:nth-child(2)');
  const analyticsProgressBar = document.querySelector('.progress-bar-full .pb-track .pb-fill');
  if (analyticsProgressText) analyticsProgressText.textContent = `${journeyCompletePct}%`;
  if (analyticsProgressBar) analyticsProgressBar.style.width = `${journeyCompletePct}%`;

  // 10. Donut Chart segments & legend
  const fuel = expenseList.filter(e => e.category === 'Fuel').reduce((s, e) => s + e.amount, 0);
  const stay = expenseList.filter(e => e.category === 'Accommodation').reduce((s, e) => s + e.amount, 0);
  const darshan = expenseList.filter(e => e.category === 'Darshan').reduce((s, e) => s + e.amount, 0);
  const food = expenseList.filter(e => e.category === 'Food').reduce((s, e) => s + e.amount, 0);
  const other = expenseList.filter(e => !['Fuel', 'Accommodation', 'Darshan', 'Food'].includes(e.category)).reduce((s, e) => s + e.amount, 0);

  const donutChartSvg = document.querySelector('.donut-chart');
  if (donutChartSvg) {
    let svgContent = '';
    if (totalExpenses === 0) {
      svgContent = `<circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="30" />
                    <text x="100" y="95" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">₹0</text>
                    <text x="100" y="115" text-anchor="middle" fill="#aaa" font-size="11">Total</text>`;
    } else {
      const categories = [
        { name: 'Fuel', amount: fuel, color: '#FF6B35' },
        { name: 'Stay', amount: stay, color: '#9C27B0' },
        { name: 'Darshan', amount: darshan, color: '#4CAF50' },
        { name: 'Food', amount: food, color: '#FFC107' },
        { name: 'Other', amount: other, color: '#2196F3' }
      ].filter(c => c.amount > 0);
      
      let currentOffset = 0;
      const circumference = 2 * Math.PI * 80;
      
      categories.forEach(c => {
        const pct = c.amount / totalExpenses;
        const strokeDash = pct * circumference;
        const strokeDashArray = `${strokeDash.toFixed(1)} ${(circumference - strokeDash).toFixed(1)}`;
        const strokeDashOffset = (-currentOffset).toFixed(1);
        
        svgContent += `<circle cx="100" cy="100" r="80" fill="none" stroke="${c.color}" stroke-width="30" 
                          stroke-dasharray="${strokeDashArray}" stroke-dashoffset="${strokeDashOffset}" 
                          transform="rotate(-90 100 100)"/>`;
        currentOffset += strokeDash;
      });
      
      const formattedTotal = totalExpenses >= 1000 ? `₹${(totalExpenses/1000).toFixed(1)}k` : `₹${totalExpenses}`;
      svgContent += `<text x="100" y="95" text-anchor="middle" fill="#fff" font-size="18" font-weight="bold">${formattedTotal}</text>
                     <text x="100" y="115" text-anchor="middle" fill="#aaa" font-size="11">Total</text>`;
    }
    donutChartSvg.innerHTML = svgContent;
  }

  const donutLegend = document.querySelector('.donut-legend');
  if (donutLegend) {
    if (totalExpenses === 0) {
      donutLegend.innerHTML = '<p style="font-size:12px;color:var(--text-muted);text-align:center;">No expenses logged yet</p>';
    } else {
      const categories = [
        { name: 'Fuel', amount: fuel, color: '#FF6B35' },
        { name: 'Stay', amount: stay, color: '#9C27B0' },
        { name: 'Darshan', amount: darshan, color: '#4CAF50' },
        { name: 'Food', amount: food, color: '#FFC107' },
        { name: 'Other', amount: other, color: '#2196F3' }
      ];
      
      donutLegend.innerHTML = categories.map(c => {
        const pct = totalExpenses > 0 ? Math.round((c.amount / totalExpenses) * 100) : 0;
        return `
          <div class="legend-item">
            <span class="leg-dot" style="background:${c.color}"></span>
            <span>${c.name} (₹${c.amount.toLocaleString()} · ${pct}%)</span>
          </div>
        `;
      }).join('');
    }
  }

  // 11. Travel Milestones
  const milestonesList = document.querySelector('.milestones-list');
  if (milestonesList) {
    const msItems = milestonesList.querySelectorAll('.milestone');
    if (msItems.length >= 6) {
      const begun = currentTemple.id > 1 || visitedCount > 0;
      msItems[0].classList.toggle('achieved', begun);
      
      const kanyakumariVisited = temples.find(t => t.name === "Kanyakumari")?.visited;
      msItems[1].classList.toggle('achieved', !!kanyakumariVisited);
      
      const crossed1000 = currentTemple.distance >= 1000;
      msItems[2].classList.toggle('achieved', crossed1000);
      
      const thanjavurVisited = temples.find(t => t.name === "Thanjavur")?.visited;
      msItems[3].classList.toggle('achieved', !!thanjavurVisited);
      
      const tirupatiVisited = temples.find(t => t.name === "Tirupati")?.visited;
      msItems[4].classList.toggle('achieved', !!tirupatiVisited);
      
      const complete = currentTemple.id === 11;
      msItems[5].classList.toggle('achieved', complete);
    }
  }

  // 12. Daily Distance Bar Chart
  renderBarChart();
}
window.updateDashboardStats = updateDashboardStats;

function initDate() {
  const el = document.getElementById('currentDate');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      showTab(tab);
      // Close mobile nav
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function showTab(tab) {
  currentTab = tab;

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });

  // Force show/hide using both class AND inline style
  // (inline style ensures it overrides any conflicting CSS/inline-style set elsewhere)
  document.querySelectorAll('.tab-content').forEach(c => {
    const isActive = c.id === `tab-${tab}`;
    c.classList.toggle('active', isActive);
    c.style.removeProperty('display');    // clear old override first
    if (isActive) {
      c.style.display = 'block';          // force visible
      c.style.visibility = 'visible';
      c.style.opacity = '1';
    } else {
      c.style.display = 'none';           // force hidden
    }
  });

  // Update page header
  const titles = {
    dashboard: ['Sacred Journey Dashboard', 'South India Pilgrimage Tour · 8 Days · 10 Temples'],
    route: ['Pilgrimage Route Map', 'GPS Tracking · Interactive Map'],
    temples: ['Temple Directory', 'Detailed information for all 10 sacred destinations'],
    schedule: ['8-Day Schedule', 'Day-by-day pilgrimage itinerary'],
    expenses: ['Expense Tracker', 'Journey cost management & analytics'],
    weather: ['Weather Updates', 'Real-time weather at upcoming destinations'],
    analytics: ['Trip Analytics', 'Journey statistics & travel insights'],
    emergency: ['Emergency Services', 'Quick access contacts & nearby services'],
  };
  if (titles[tab]) {
    const pt = document.getElementById('pageTitle');
    const ps = document.getElementById('pageSubtitle');
    if (pt) pt.textContent = titles[tab][0];
    if (ps) ps.textContent = titles[tab][1];
  }

  // Trigger re-renders for dynamic tabs
  if (tab === 'weather') {
    renderWeather();
  }
  if (tab === 'temples') {
    renderTemples();
  }
  if (tab === 'schedule') {
    renderSchedule();
  }
  if (tab === 'expenses') {
    renderExpenses();
  }

  // Leaflet map init/resize when route tab opens
  if (tab === 'route') {
    try {
      if (typeof L === 'undefined') {
        throw new Error("Leaflet library is not loaded");
      }
      if (!map) {
        initLeafletMap();
      } else {
        setTimeout(() => {
          if (map) map.invalidateSize();
        }, 100);
      }
    } catch (mapErr) {
      console.error("Failed to initialize map:", mapErr);
      const container = document.getElementById('mapContainer');
      if (container) {
        container.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--text-muted); font-size: 13px;">
          ⚠️ Failed to load Interactive Map. Please check your internet connection and reload.<br>
          <span style="font-size: 11px; color: var(--text-muted);">(${mapErr.message})</span>
        </div>`;
      }
    }
  }
}
window.showTab = showTab;

function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

// ===== RENDER ROUTE TIMELINE =====
function renderRouteTimeline() {
  const container = document.querySelector('.route-timeline');
  if (!container) return;

  container.innerHTML = temples.map((t, i) => {
    let statusClass = 'upcoming';
    if (t.visited) statusClass = 'visited';
    else if (t.current) statusClass = 'current';

    let dotClass = statusClass;
    let dotEmoji = t.visited ? '✓' : t.current ? '▶' : `${i + 1}`;

    return `
      <div class="timeline-item ${statusClass}" onclick="window.showPlaceDetails(${t.id})" style="cursor: pointer;">
        <div class="tl-dot ${dotClass}">${dotEmoji}</div>
        <div>
          <div class="tl-name">${t.name}</div>
          <div class="tl-sub">${t.deity}</div>
        </div>
        <div class="tl-dist">${t.distance > 0 ? t.distance + ' km' : 'Start'}</div>
      </div>
    `;
  }).join('');
}

// ===== RENDER TEMPLES =====
function renderTemples() {
  const grid = document.getElementById('templesGrid');
  if (!grid) return;

  grid.innerHTML = temples.map((t, i) => {
    let status = 'upcoming';
    let statusLabel = 'Upcoming';
    if (t.visited) { status = 'visited'; statusLabel = '✓ Visited'; }
    else if (t.current) { status = 'current'; statusLabel = '▶ Current'; }

    return `
      <div class="temple-card" onclick="window.showPlaceDetails(${t.id})" style="border-top: 3px solid ${t.color}20; border-top-color: ${t.color}40">
        <div class="temple-card-header">
          <div class="tc-emoji">${t.image}</div>
          <div class="tc-info">
            <div class="tc-num">Stop ${String(i + 1).padStart(2, '0')}</div>
            <div class="tc-name">${t.name}</div>
            <div class="tc-deity">${t.deity}</div>
            <div class="tc-loc">📍 ${t.location}</div>
          </div>
          <div class="tc-status ${status}">${statusLabel}</div>
        </div>
        <div class="temple-card-body">
          <p class="tc-significance">${t.significance}</p>
          <div class="tc-darshan">
            <span>⏰</span>
            <span><strong>Darshan:</strong> ${t.darshan}</span>
          </div>
          <div class="tc-footer">
            <span class="tc-dist">${t.distance > 0 ? '🛣️ ' + t.distance + ' km from start' : '🚩 Starting Point'}</span>
            <button class="btn-sm" onclick="event.stopPropagation(); alert('Opening ${t.name} in Google Maps...')">🗺️ Navigate</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== RENDER SCHEDULE =====
function renderSchedule() {
  const container = document.getElementById('scheduleFull');
  if (!container) return;

  const currentTemple = temples.find(t => t.current) || temples[0];
  const day = currentTemple.day || 1;

  container.innerHTML = schedule.map((s, i) => {
    const isActive = (i + 1) === day;
    return `
      <div class="sch-row ${isActive ? 'active-day' : ''}">
        <div class="sch-day">${s.day}</div>
        <div class="sch-date">${s.date}</div>
        <div class="sch-temple-name">${s.temple}</div>
        <div class="sch-activity">${s.activity}</div>
      </div>
    `;
  }).join('');
}

// ===== RENDER EXPENSES =====
// ===== RENDER EXPENSES =====
function renderExpenses() {
  try {
    expenseList = (expenseList || []).filter(e => e && typeof e === 'object');
    renderExpenseSummary();
    renderExpenseTable();
    renderMemberSummary();
  } catch (err) {
    console.error("Error rendering expenses:", err);
  }
}

function renderExpenseSummary() {
  const container = document.getElementById('expenseSummary');
  if (!container) return;

  const total = expenseList.reduce((s, e) => s + (e.amount || 0), 0);
  const fuel = expenseList.filter(e => e.category === 'Fuel').reduce((s, e) => s + (e.amount || 0), 0);
  const stay = expenseList.filter(e => e.category === 'Accommodation').reduce((s, e) => s + (e.amount || 0), 0);
  const darshan = expenseList.filter(e => e.category === 'Darshan').reduce((s, e) => s + (e.amount || 0), 0);
  const food = expenseList.filter(e => e.category === 'Food').reduce((s, e) => s + (e.amount || 0), 0);

  container.innerHTML = `
    <div class="exp-sum-card">
      <div class="exp-sum-icon">💰</div>
      <div class="exp-sum-val">₹${total.toLocaleString()}</div>
      <div class="exp-sum-label">Total Spent</div>
    </div>
    <div class="exp-sum-card">
      <div class="exp-sum-icon">⛽</div>
      <div class="exp-sum-val">₹${fuel.toLocaleString()}</div>
      <div class="exp-sum-label">Fuel</div>
    </div>
    <div class="exp-sum-card">
      <div class="exp-sum-icon">🏨</div>
      <div class="exp-sum-val">₹${stay.toLocaleString()}</div>
      <div class="exp-sum-label">Stay</div>
    </div>
    <div class="exp-sum-card">
      <div class="exp-sum-icon">🛕</div>
      <div class="exp-sum-val">₹${darshan.toLocaleString()}</div>
      <div class="exp-sum-label">Darshan</div>
    </div>
    <div class="exp-sum-card">
      <div class="exp-sum-icon">🍛</div>
      <div class="exp-sum-val">₹${food.toLocaleString()}</div>
      <div class="exp-sum-label">Food</div>
    </div>
  `;
}

function renderExpenseTable() {
  const tbody = document.getElementById('expenseTableBody');
  if (!tbody) return;

  if (expenseList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);font-size:12px;padding:20px;">No expenses logged yet. Use the form above to add one!</td></tr>';
    return;
  }

  tbody.innerHTML = expenseList.map((e, idx) => {
    const category = e.category || 'Other';
    const amount = e.amount || 0;
    const paidBy = e.paidBy || 'Pandu';
    const date = e.date || '';
    const temple = e.temple || '';
    const description = e.description || '';

    // Render inline edit row for the currently editing expense
    if (editingExpenseIndex === idx) {
      return `
        <tr style="background: rgba(212,168,67,0.06); border: 1px solid rgba(212,168,67,0.2);">
          <td style="padding:6px;">${date}</td>
          <td style="padding:6px;"><input type="text" id="ei_temple" value="${temple}" style="width:100%;padding:4px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:11px;"></td>
          <td style="padding:6px;">
            <select id="ei_cat" style="width:100%;padding:4px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:11px;">
              ${['Fuel','Accommodation','Food','Darshan','Shopping','Other'].map(c => `<option value="${c}" ${c===category?'selected':''}>${c}</option>`).join('')}
            </select>
          </td>
          <td style="padding:6px;">
            <select id="ei_paidby" style="width:100%;padding:4px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:11px;">
              ${['Pandu','Arun Kumar','Niranjan','Dvn'].map(m => `<option value="${m}" ${m===paidBy?'selected':''}>${m}</option>`).join('')}
            </select>
          </td>
          <td style="padding:6px;"><input type="text" id="ei_desc" value="${description.replace(/"/g,'&quot;')}" style="width:100%;padding:4px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:11px;"></td>
          <td style="padding:6px;"><input type="number" id="ei_amt" value="${amount}" style="width:80px;padding:4px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:11px;"></td>
          <td style="padding:6px;">
            <div style="display:flex;gap:4px;flex-direction:column;">
              <button onclick="event.stopPropagation(); window.saveEditExpense(${idx})" style="padding:4px 8px;font-size:10px;background:rgba(76,175,80,0.2);color:#4CAF50;border:1px solid rgba(76,175,80,0.4);border-radius:5px;cursor:pointer;">💾 Save</button>
              <button onclick="event.stopPropagation(); window.cancelEditExpense()" style="padding:4px 8px;font-size:10px;background:rgba(244,67,54,0.12);color:#EF5350;border:1px solid rgba(244,67,54,0.3);border-radius:5px;cursor:pointer;">✖ Cancel</button>
            </div>
          </td>
        </tr>
      `;
    }

    return `
      <tr>
        <td style="padding:8px 10px;">${date}</td>
        <td style="padding:8px 10px;">${temple}</td>
        <td style="padding:8px 10px;"><span class="cat-badge ${category.toLowerCase()}">${category}</span></td>
        <td style="padding:8px 10px;"><strong>${paidBy}</strong></td>
        <td style="padding:8px 10px;">${description}</td>
        <td style="padding:8px 10px;">₹${amount.toLocaleString()}</td>
        <td style="padding:8px 10px;">
          <div style="display:flex;gap:6px;">
            <button class="btn-sm" onclick="event.stopPropagation(); window.showEditExpense(${idx})" style="padding:4px 8px;font-size:10px;background:rgba(76,175,80,0.12);color:#4CAF50;border:1px solid rgba(76,175,80,0.3);border-radius:5px;cursor:pointer;">✏️</button>
            <button class="btn-sm" onclick="event.stopPropagation(); window.deleteExpense(${idx})" style="padding:4px 8px;font-size:10px;background:rgba(244,67,54,0.12);color:#EF5350;border:1px solid rgba(244,67,54,0.3);border-radius:5px;cursor:pointer;">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderMemberSummary() {
  const container = document.getElementById('memberSummaryContainer');
  if (!container) return;

  const members = ['Pandu', 'Arun Kumar', 'Niranjan', 'Dvn'];
  const summary = {};
  members.forEach(m => summary[m] = 0);

  expenseList.forEach(e => {
    const payer = e.paidBy || 'Pandu';
    if (summary.hasOwnProperty(payer)) {
      summary[payer] += (e.amount || 0);
    }
  });

  container.innerHTML = members.map(m => `
    <div class="exp-sum-card" style="margin: 0; background: rgba(255,255,255,0.02); border: 1px solid var(--border);">
      <div class="exp-sum-icon" style="font-size: 24px;">👤</div>
      <div class="exp-sum-val" style="font-size: 16px; margin: 4px 0; font-weight: bold; color: var(--accent-gold);">₹${summary[m].toLocaleString()}</div>
      <div class="exp-sum-label" style="font-size: 11px; text-transform: none; color: var(--text-muted);">${m}</div>
    </div>
  `).join('');
}

// ===== EXPENSE INLINE EDIT =====
window.showEditExpense = function(index) {
  editingExpenseIndex = index;
  renderExpenses();
};

window.cancelEditExpense = function() {
  editingExpenseIndex = null;
  renderExpenses();
};

window.saveEditExpense = function(idx) {
  if (idx < 0 || idx >= expenseList.length) return;

  const catEl = document.getElementById('ei_cat');
  const paidByEl = document.getElementById('ei_paidby');
  const descEl = document.getElementById('ei_desc');
  const amtEl = document.getElementById('ei_amt');
  const templeEl = document.getElementById('ei_temple');

  if (!catEl || !paidByEl || !descEl || !amtEl) return;

  const cat = catEl.value;
  const paidBy = paidByEl.value;
  const desc = descEl.value.trim();
  const amt = parseFloat(amtEl.value);
  const temple = templeEl ? templeEl.value.trim() : '';

  if (!desc || !amt || isNaN(amt) || amt <= 0) {
    alert('Please fill in description and a valid amount.');
    return;
  }

  expenseList[idx].category = cat;
  expenseList[idx].paidBy = paidBy;
  expenseList[idx].description = desc;
  expenseList[idx].amount = amt;
  if (temple) expenseList[idx].temple = temple;

  localStorage.setItem('yatra_expenses', JSON.stringify(expenseList));

  if (localStorage.getItem('yatra_app_role') !== 'family') {
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseList)
    }).catch(e => console.error('Error saving edited expense to server', e));
  }

  editingExpenseIndex = null;
  renderExpenses();
  updateDashboardStats();
};

window.deleteExpense = function(index) {
  if (index < 0 || index >= expenseList.length) return;
  const e = expenseList[index];
  if (!confirm(`Delete expense "${e.description}" (₹${e.amount.toLocaleString()})?`)) return;

  expenseList.splice(index, 1);
  localStorage.setItem('yatra_expenses', JSON.stringify(expenseList));

  if (localStorage.getItem('yatra_app_role') !== 'family') {
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseList)
    }).catch(e => console.error("Error saving expenses after delete to server", e));
  }

  renderExpenses();
  updateDashboardStats();
};

window.addExpense = function() {
  const cat = document.getElementById('expCat').value;
  const paidBy = document.getElementById('expPaidBy').value;
  const desc = document.getElementById('expDesc').value;
  const amt = parseFloat(document.getElementById('expAmt').value);
  const temple = document.getElementById('expTemple').value;

  if (!desc || !amt || isNaN(amt)) {
    alert('Please fill in all fields');
    return;
  }

  const newExp = {
    id: expenseList.length + 1,
    category: cat,
    paidBy: paidBy,
    description: desc,
    amount: amt,
    date: new Date().toISOString().split('T')[0],
    temple: temple || 'Current Location'
  };

  expenseList.unshift(newExp);
  localStorage.setItem('yatra_expenses', JSON.stringify(expenseList));

  if (localStorage.getItem('yatra_app_role') !== 'family') {
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseList)
    }).catch(e => console.error("Error saving expense to server", e));
  }

  // Clear the inline form fields
  const descEl = document.getElementById('expDesc');
  const amtEl = document.getElementById('expAmt');
  const templeEl = document.getElementById('expTemple');
  if (descEl) descEl.value = '';
  if (amtEl) amtEl.value = '';
  if (templeEl) templeEl.value = '';

  renderExpenses();
  updateDashboardStats();
};

window.exportExpensesToCSV = function() {
  if (expenseList.length === 0) {
    alert("No expenses logged yet!");
    return;
  }

  const headers = ["Date", "Temple/Location", "Category", "Paid By", "Description", "Amount (INR)"];
  const rows = expenseList.map(e => [
    e.date,
    e.temple,
    e.category,
    e.paidBy || "Pandu",
    e.description,
    e.amount
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(val => {
      let cell = val === undefined || val === null ? "" : String(val);
      if (cell.includes(",") || cell.includes('"') || cell.includes("\n") || cell.includes("\r")) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(","))
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `YOUNG_BOYS_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ===== WMO WEATHER CODE MAPPING =====
function mapWMOCodeToWeather(code) {
  const mappings = {
    0: { icon: "☀️", desc: "Clear sky" },
    1: { icon: "🌤️", desc: "Mainly clear" },
    2: { icon: "⛅", desc: "Partly cloudy" },
    3: { icon: "☁️", desc: "Overcast" },
    45: { icon: "🌫️", desc: "Foggy" },
    48: { icon: "🌫️", desc: "Depositing rime fog" },
    51: { icon: "🌧️", desc: "Light drizzle" },
    53: { icon: "🌧️", desc: "Moderate drizzle" },
    55: { icon: "🌧️", desc: "Dense drizzle" },
    56: { icon: "🌧️", desc: "Light freezing drizzle" },
    57: { icon: "🌧️", desc: "Dense freezing drizzle" },
    61: { icon: "🌧️", desc: "Slight rain" },
    63: { icon: "🌧️", desc: "Moderate rain" },
    65: { icon: "🌧️", desc: "Heavy rain" },
    66: { icon: "🌧️", desc: "Light freezing rain" },
    67: { icon: "🌧️", desc: "Heavy freezing rain" },
    71: { icon: "❄️", desc: "Slight snow fall" },
    73: { icon: "❄️", desc: "Moderate snow fall" },
    75: { icon: "❄️", desc: "Heavy snow fall" },
    77: { icon: "❄️", desc: "Snow grains" },
    80: { icon: "🌧️", desc: "Slight rain showers" },
    81: { icon: "🌧️", desc: "Moderate rain showers" },
    82: { icon: "🌧️", desc: "Violent rain showers" },
    85: { icon: "❄️", desc: "Slight snow showers" },
    86: { icon: "❄️", desc: "Heavy snow showers" },
    95: { icon: "⛈️", desc: "Thunderstorm" },
    96: { icon: "⛈️", desc: "Thunderstorm with slight hail" },
    99: { icon: "⛈️", desc: "Thunderstorm with heavy hail" }
  };
  return mappings[code] || { icon: "🌤️", desc: "Partly Cloudy" };
}

// ===== FETCH LIVE WEATHER FROM OPEN-METEO =====
async function fetchLiveWeather(lat, lng, cityName) {
  const cacheKey = `yatra_weather_v2_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  const cached = localStorage.getItem(cacheKey);
  const now = Date.now();

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Valid for 30 minutes
      if (now - parsed.timestamp < 1800000) {
        return parsed.data;
      }
    } catch (e) {
      console.warn("Error reading cached weather", e);
    }
  }

  // Generate dynamic fallback forecast starting from today
  const generateDynamicFallbackForecast = () => {
    const fallback = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayName = daysOfWeek[futureDate.getDay()];
      const mockIcons = ['🌤️', '🌧️', '⛅', '☀️'];
      const mockTemps = [31, 28, 30, 33];
      fallback.push({
        day: dayName,
        icon: mockIcons[i % 4],
        temp: mockTemps[i % 4]
      });
    }
    return fallback;
  };

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    const wCode = data.current.weather_code;
    const mapped = mapWMOCodeToWeather(wCode);

    const forecast = [];
    if (data.daily && data.daily.time) {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i < Math.min(4, data.daily.time.length); i++) {
        const dateStr = data.daily.time[i];
        const tempMax = Math.round(data.daily.temperature_2m_max[i]);
        const wCodeMax = data.daily.weather_code[i];
        const mappedMax = mapWMOCodeToWeather(wCodeMax);
        
        // Parse UTC date string correctly to local timezone weekday
        const dateParts = dateStr.split('-');
        const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const dayName = daysOfWeek[dateObj.getDay()];
        
        forecast.push({
          day: dayName,
          icon: mappedMax.icon,
          temp: tempMax
        });
      }
    } else {
      forecast.push(...generateDynamicFallbackForecast());
    }

    const weatherInfo = {
      name: cityName,
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      wind: `${Math.round(data.current.wind_speed_10m)} km/h`,
      desc: mapped.desc,
      icon: mapped.icon,
      vis: "10 km",
      sea: "N/A",
      forecast: forecast
    };

    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: now,
      data: weatherInfo
    }));

    return weatherInfo;
  } catch (error) {
    console.error(`Error fetching live weather for ${cityName}:`, error);
    // Fallback to dynamic mock data
    const mock = weatherData.find(w => w.name.toLowerCase().includes(cityName.toLowerCase())) || {
      name: cityName,
      temp: 30,
      humidity: 70,
      wind: "12 km/h",
      desc: "Partly Cloudy",
      icon: "⛅",
      vis: "10 km",
      sea: "N/A"
    };
    mock.forecast = generateDynamicFallbackForecast();
    return mock;
  }
}

// ===== RENDER WEATHER =====
function renderWeather() {
  const grid = document.getElementById('weatherGrid');
  if (!grid) return;

  // Show placeholder skeleton items while loading
  grid.innerHTML = temples.slice(0, 10).map(() => `
    <div class="weather-location-card" style="opacity: 0.5; height: 160px; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--border);">
      <div style="text-align: center;">
        <span style="display: block; font-size: 20px; animation: floatLockSymbols 2s ease-in-out infinite;">🌤️</span>
        <span style="font-size: 11px; color: var(--text-muted); font-family: 'Cinzel', serif;">Fetching Live...</span>
      </div>
    </div>
  `).join('');

  // Fetch all weather info concurrently
  const weatherPromises = temples.slice(0, 10).map(t => {
    const match = weatherData.find(w => w.name.includes(t.name)) || { loc: t.location };
    return fetchLiveWeather(t.lat, t.lng, t.name).then(live => ({
      ...live,
      loc: match.loc
    }));
  });

  Promise.all(weatherPromises).then(liveList => {
    // Render the grid with actual live data
    if (document.getElementById('weatherGrid')) {
      document.getElementById('weatherGrid').innerHTML = liveList.map(w => `
        <div class="weather-location-card">
          <div class="wl-name">${w.name}</div>
          <div class="wl-loc">📍 ${w.loc}</div>
          <div class="wl-main">
            <div class="wl-icon">${w.icon}</div>
            <div>
              <div class="wl-temp">${w.temp}°C</div>
              <div class="wl-desc">${w.desc}</div>
            </div>
          </div>
          <div class="wl-details">
            <div class="wl-detail-item"><span>Humidity</span><span>${w.humidity}%</span></div>
            <div class="wl-detail-item"><span>Wind</span><span>${w.wind}</span></div>
            <div class="wl-detail-item"><span>Visibility</span><span>${w.vis}</span></div>
            <div class="wl-detail-item"><span>Sea State</span><span>${w.sea}</span></div>
          </div>
        </div>
      `).join('');
    }
  }).catch(err => {
    console.error("Error displaying live weather", err);
    // Fallback: render static weatherData
    grid.innerHTML = weatherData.map(w => `
      <div class="weather-location-card">
        <div class="wl-name">${w.name}</div>
        <div class="wl-loc">📍 ${w.loc}</div>
        <div class="wl-main">
          <div class="wl-icon">${w.icon}</div>
          <div>
            <div class="wl-temp">${w.temp}°C</div>
            <div class="wl-desc">${w.desc}</div>
          </div>
        </div>
        <div class="wl-details">
          <div class="wl-detail-item"><span>Humidity</span><span>${w.humidity}%</span></div>
          <div class="wl-detail-item"><span>Wind</span><span>${w.wind}</span></div>
          <div class="wl-detail-item"><span>Visibility</span><span>${w.vis}</span></div>
          <div class="wl-detail-item"><span>Sea State</span><span>${w.sea}</span></div>
        </div>
      </div>
    `).join('');
  });
}

// ===== FETCH & RENDER VEHICLE STOPS =====
window.fetchAndRenderStops = function() {
  fetch('/api/stops')
    .then(res => res.json())
    .then(stopsList => {
      // Update stops markers on Leaflet map
      updateStopMarkersOnMap(stopsList);

      const badge = document.getElementById('stops-status-badge');
      const valEl = document.getElementById('stat-stops-val');
      const fillEl = document.getElementById('stat-stops-fill');
      const container = document.getElementById('stopsListContainer');
      
      const count = stopsList.length;
      
      // Update badge
      if (badge) {
        badge.textContent = `${count} Registered Stop${count !== 1 ? 's' : ''}`;
      }
      
      // Update stats card
      if (valEl) {
        valEl.textContent = `${count} Stop${count !== 1 ? 's' : ''}`;
      }
      if (fillEl) {
        const pct = Math.min(100, (count / 10) * 100);
        fillEl.style.width = `${pct}%`;
      }
      
      // Render stop list logs
      if (container) {
        if (count === 0) {
          container.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); grid-column: 1 / -1; margin: 0; padding: 10px 0;">No stops recorded yet.</p>`;
          return;
        }
        
        container.innerHTML = stopsList.map(stop => {
          const startTime = new Date(stop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const durationText = stop.active ? 'Active Now ⏳' : `${stop.duration} min${stop.duration !== 1 ? 's' : ''}`;
          const displayLoc = stop.placeName || `${stop.lat.toFixed(4)}°, ${stop.lng.toFixed(4)}°`;
          
          return `
            <div class="stop-log-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; position: relative;">
              <span style="font-size: 18px; background: rgba(244, 67, 54, 0.1); padding: 8px; border-radius: 6px; border: 1px solid rgba(244, 67, 54, 0.25); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">🛑</span>
              <div style="flex: 1; min-width: 0;">
                <div style="font-family: 'Cinzel', serif; font-size: 12px; font-weight: bold; color: var(--text-primary);">Stop #${stop.id}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Started at ${startTime}</div>
              </div>
              <div style="text-align: right; flex-shrink: 0; max-width: 50%;">
                <span class="badge ${stop.active ? 'badge-green' : 'badge-red'}" style="font-family: 'Cinzel', serif; font-size: 9px; padding: 2px 6px; border-radius: 4px;">${durationText}</span>
                <div style="font-size: 9px; color: var(--text-secondary); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${displayLoc}">📍 ${displayLoc}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    })
    .catch(err => console.error("Error fetching vehicle stops list:", err));
};

// ===== RENDER BAR CHART =====
function renderBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;

  const currentTemple = temples.find(t => t.current) || temples[0];
  const day = currentTemple.day || 1;

  const fullDailyDistances = [1442, 415, 0, 454, 103, 400, 0, 630];
  const currentBarData = [];
  for (let i = 0; i < 8; i++) {
    const dayVal = (i + 1 <= day) ? fullDailyDistances[i] : 0;
    currentBarData.push({ label: `Day ${i + 1}`, val: dayVal });
  }

  const max = Math.max(...currentBarData.map(d => d.val));

  container.innerHTML = currentBarData.map(d => {
    const pct = max > 0 ? (d.val / max) * 100 : 0;
    return `
      <div class="bar-item">
        <div class="bar-val">${d.val > 0 ? d.val + ' km' : 'Rest'}</div>
        <div class="bar-col" style="height:${Math.max(pct, d.val > 0 ? 5 : 0)}%"></div>
        <div class="bar-label">${d.label}</div>
      </div>
    `;
  }).join('');
}

// ===== GPS LOCATION & TRACKING =====
let gpsWatchId = null;
let currentCoords = null;
let simInterval = null;
let simProgress = 0;
let isSimulationPaused = false;
let currentSimTargetIndex = 4; // next is Day 5 (Srivilliputhur index 4)

// Persistent background tracking (WakeLock + Audio Keep-Alive)
let wakeLock = null;
let keepAliveAudio = null;

// Base64 1-second silent WAV file to keep iOS/Android audio threads alive
const SILENT_WAV_BASE64 = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';

// Show PWA / web notification that live location is running in the background
function showLiveTrackingNotification() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Temple Tour Tracker', {
          body: '📍 Live GPS location tracking is active in background.',
          icon: '/assets/vishnu_namam_3d.png',
          tag: 'live-tracking',
          badge: '/assets/vishnu_namam_3d.png',
          requireInteraction: true,
          silent: true
        });
      });
    } else {
      new Notification('Temple Tour Tracker', {
        body: '📍 Live GPS location tracking is active in background.',
        icon: '/assets/vishnu_namam_3d.png',
        tag: 'live-tracking',
        requireInteraction: true,
        silent: true
      });
    }
  }
}

function clearLiveTrackingNotification() {
  if (!('Notification' in window)) return;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.getNotifications({ tag: 'live-tracking' }).then(notifications => {
        notifications.forEach(notification => notification.close());
      });
    });
  }
}

async function startKeepAlive() {
  // Request Location permission upfront alongside notification
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location permission verified on keep-alive start');
      },
      (error) => {
        console.warn('Location permission check on keep-alive start:', error.message);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  // 1. Play silent audio loop
  try {
    if (!keepAliveAudio) {
      keepAliveAudio = new Audio(SILENT_WAV_BASE64);
      keepAliveAudio.loop = true;
    }
    await keepAliveAudio.play();
    console.log('Background audio keep-alive started');
  } catch (err) {
    console.warn('Audio keep-alive failed to play:', err.message);
  }

  // 2. Request Screen Wake Lock to prevent screen sleep
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Screen Wake Lock acquired');
    }
  } catch (err) {
    console.warn('Wake Lock request failed:', err.message);
  }

  // 3. Request Notification permission & show notification
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      showLiveTrackingNotification();
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showLiveTrackingNotification();
        }
      });
    }
  }
}

function stopKeepAlive() {
  // 1. Stop audio
  if (keepAliveAudio) {
    keepAliveAudio.pause();
    keepAliveAudio = null;
  }

  // 2. Release wake lock
  if (wakeLock) {
    wakeLock.release().then(() => {
      wakeLock = null;
    }).catch(() => {
      wakeLock = null;
    });
  }

  // 3. Clear background notification
  clearLiveTrackingNotification();
}

// Re-acquire Wake Lock when app becomes visible again
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && (gpsWatchId || (simInterval && !isSimulationPaused))) {
    if ('wakeLock' in navigator && !wakeLock) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Screen Wake Lock re-acquired');
      } catch (err) {}
    }
  }
});

function queueOfflineLocation(locData) {
  try {
    let queue = [];
    const stored = localStorage.getItem('yatra_offline_location_queue');
    if (stored) {
      queue = JSON.parse(stored);
    }
    // Limit queue size to 5000 coordinates to prevent storage limits
    if (queue.length > 5000) {
      queue.shift();
    }
    queue.push(locData);
    localStorage.setItem('yatra_offline_location_queue', JSON.stringify(queue));
    console.log(`Location queued offline. Queue size: ${queue.length}`);
  } catch (e) {
    console.error("Error queuing offline location:", e);
  }
}

let isSyncingOffline = false;
async function syncOfflineLocations() {
  if (isSyncingOffline) return;
  if (!navigator.onLine) return;

  try {
    const stored = localStorage.getItem('yatra_offline_location_queue');
    if (!stored) return;

    const queue = JSON.parse(stored);
    if (!queue || queue.length === 0) return;

    isSyncingOffline = true;
    console.log(`Attempting to sync ${queue.length} offline location(s)...`);

    const res = await fetch('/api/location/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: queue })
    });

    if (res.ok) {
      localStorage.removeItem('yatra_offline_location_queue');
      console.log('Offline locations synced successfully.');
      window.fetchAndRenderStops();
    } else {
      console.warn('Failed to sync offline locations. Server status:', res.status);
    }
  } catch (e) {
    console.error('Error syncing offline locations:', e);
  } finally {
    isSyncingOffline = false;
  }
}

// Auto sync when back online
window.addEventListener('online', syncOfflineLocations);

// Periodically check for sync every 60 seconds
setInterval(syncOfflineLocations, 60000);

let lastPublishedTime = 0;
let lastPublishedCoords = null;

function publishLiveLocation(locData) {
  localStorage.setItem('yatra_live_location', JSON.stringify(locData));
  
  // Throttle server uploads: only upload if at least 30 seconds have passed
  // OR if the user has moved more than 250 meters
  const now = Date.now();
  let shouldUpload = false;
  
  if (now - lastPublishedTime > 30000) { // 30 seconds
    shouldUpload = true;
  } else if (lastPublishedCoords) {
    const dist = getDistanceKM(locData.lat, locData.lng, lastPublishedCoords.lat, lastPublishedCoords.lng);
    if (dist > 0.25) { // 250 meters
      shouldUpload = true;
    }
  } else {
    shouldUpload = true;
  }

  if (shouldUpload) {
    lastPublishedTime = now;
    lastPublishedCoords = { lat: locData.lat, lng: locData.lng };

    if (localStorage.getItem('yatra_app_role') !== 'family') {
      if (!navigator.onLine) {
        queueOfflineLocation(locData);
        return;
      }
      fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locData)
      })
      .then(res => {
        if (res.ok) {
          window.fetchAndRenderStops();
          syncOfflineLocations();
        } else {
          queueOfflineLocation(locData);
        }
      })
      .catch(e => {
        console.error("Error publishing location to server, queuing offline:", e);
        queueOfflineLocation(locData);
      });
    }
  }
}

let isCapacitorTracking = false;

window.toggleLiveGPS = async function() {
  const badge = document.getElementById('gps-status-badge');
  const btn = document.getElementById('btn-toggle-gps');
  const coordsEl = document.getElementById('gps-coords');

  if (gpsWatchId) {
    // Stop tracking
    if (isCapacitorTracking) {
      try {
        const { BackgroundGeolocation } = window.Capacitor.Plugins;
        await BackgroundGeolocation.removeWatcher({ id: gpsWatchId });
      } catch (e) {
        console.error("Error stopping Capacitor background geolocation:", e);
      }
      isCapacitorTracking = false;
    } else {
      navigator.geolocation.clearWatch(gpsWatchId);
    }
    gpsWatchId = null;
    localStorage.setItem('yatra_gps_active', 'false');
    badge.textContent = 'Simulator Ready';
    badge.className = 'badge';
    btn.textContent = '▶️ Start GPS Tracking';
    coordsEl.textContent = 'Not Tracking';
    document.getElementById('gps-speed').textContent = '0 km/h';
    stopKeepAlive();
  } else {
    // Start tracking
    localStorage.setItem('yatra_gps_active', 'true');
    badge.textContent = 'Tracking Live';
    badge.className = 'badge badge-green';
    btn.textContent = '⏹️ Stop GPS Tracking';
    coordsEl.textContent = 'Locating...';
    startKeepAlive();

    const isCapacitor = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.BackgroundGeolocation;

    if (isCapacitor) {
      try {
        const { Geolocation, BackgroundGeolocation } = window.Capacitor.Plugins;
        
        // Request Permissions using official Geolocation plugin
        let perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') {
          perm = await Geolocation.requestPermissions();
        }

        isCapacitorTracking = true;
        gpsWatchId = await BackgroundGeolocation.addWatcher(
          {
            backgroundMessage: "Tracking your tour live in background.",
            backgroundTitle: "Yatra Tracker Active",
            requestType: "requestAlwaysAuthorization",
            stale: true,
            requestPermissions: true,
            distanceFilter: 50 // update every 50 meters (battery friendly)
          },
          (position, error) => {
            if (error) {
              console.error("Capacitor background geolocation error:", error);
              coordsEl.textContent = 'Error: ' + error.message;
              return;
            }
            if (position) {
              handleCoordsUpdate(position.latitude, position.longitude, position.speed);
            }
          }
        );
      } catch (e) {
        console.error("Capacitor Background Geolocation failed to initialize, falling back to web API:", e);
        isCapacitorTracking = false;
        startBrowserTracking();
      }
    } else {
      isCapacitorTracking = false;
      startBrowserTracking();
    }
  }

  function startBrowserTracking() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    gpsWatchId = navigator.geolocation.watchPosition(
      (position) => {
        handleCoordsUpdate(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.speed
        );
      },
      (error) => {
        console.error(error);
        coordsEl.textContent = 'Error: ' + error.message;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 } // 30s cache to save battery
    );
  }

  function handleCoordsUpdate(lat, lng, rawSpeed) {
    currentCoords = { lat, lng };
    coordsEl.textContent = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
    
    // Calculate speed (if available)
    const speed = rawSpeed ? (rawSpeed * 3.6).toFixed(1) : '0';
    document.getElementById('gps-speed').textContent = `${speed} km/h`;
    
    // Find nearest temple stop
    let nearestStop = temples[0];
    let minDist = getDistanceKM(lat, lng, temples[0].lat, temples[0].lng);
    let nearestIdx = 0;
    
    for (let i = 1; i < temples.length; i++) {
      const dist = getDistanceKM(lat, lng, temples[i].lat, temples[i].lng);
      if (dist < minDist) {
        minDist = dist;
        nearestStop = temples[i];
        nearestIdx = i;
      }
    }
    
    document.getElementById('gps-nearest-stop').textContent = `${nearestStop.name} (~${minDist.toFixed(1)} km)`;

    // Calculate accurate projection along SVG segment coordinates
    const pt = getSVGCoordsForGPS(lat, lng);
    
    // Update Leaflet map marker location (with rotation and auto-follow)
    updateCarMarkerPosition(lat, lng);

    // Save location for family sharing sync
    const locData = {
      lat,
      lng,
      nearest: nearestStop.name,
      distance: minDist,
      speed: speed,
      toll: nearestStop.tollTax,
      visitedIndex: nearestIdx,
      progress: pt.ratio * 100,
      segmentIndex: pt.segmentIndex,
      timestamp: Date.now()
    };
    publishLiveLocation(locData);
  }
};

function getSVGCoordsForGPS(lat, lng) {
  let bestPt = { cx: 350, cy: 390, ratio: 0, segmentIndex: 3 }; // Default to Rameswaram
  let minDist = Infinity;
  
  for (let i = 0; i < temples.length - 1; i++) {
    const t1 = temples[i];
    const t2 = temples[i+1];
    const p1 = svgPoints[i];
    const p2 = svgPoints[i+1];
    
    // Find projection ratio onto segment
    const proj = projectOnSegment(lat, lng, t1.lat, t1.lng, t2.lat, t2.lng);
    const dist = getDistanceKM(lat, lng, proj.lat, proj.lng);
    
    if (dist < minDist) {
      minDist = dist;
      bestPt.cx = p1[0] + (p2[0] - p1[0]) * proj.ratio;
      bestPt.cy = p1[1] + (p2[1] - p1[1]) * proj.ratio;
      bestPt.ratio = proj.ratio;
      bestPt.segmentIndex = i;
    }
  }
  return bestPt;
}

function projectOnSegment(cx, cy, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const acx = cx - ax;
  const acy = cy - ay;
  
  let ab2 = abx * abx + aby * aby;
  let ratio = 0;
  if (ab2 > 0) {
    ratio = (acx * abx + acy * aby) / ab2;
  }
  ratio = Math.max(0, Math.min(1, ratio));
  
  return {
    lat: ax + abx * ratio,
    lng: ay + aby * ratio,
    ratio: ratio
  };
}

// Haversine formula
function getDistanceKM(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// ===== ROUTE SIMULATION =====
window.startSimulation = function() {
  const simPanel = document.getElementById('gps-sim-status');
  const fill = document.getElementById('sim-progress');
  const txt = document.getElementById('sim-text');
  const speedEl = document.getElementById('gps-speed');
  const coordsEl = document.getElementById('gps-coords');
  const nearestEl = document.getElementById('gps-nearest-stop');
  const btn = document.getElementById('btn-simulate-drive');

  if (simInterval) {
    // Pause / Stop simulation
    clearInterval(simInterval);
    simInterval = null;
    btn.textContent = '🚗 Resume Journey';
    speedEl.textContent = '0 km/h';
    stopKeepAlive();
    return;
  }

  // Find the current active temple
  let currentIdx = temples.findIndex(t => t.current);
  if (currentIdx === -1) currentIdx = 0;
  let nextIdx = currentIdx + 1;
  if (nextIdx >= temples.length) {
    alert("🎉 YOUNG BOYS is already completed! Return to Hanmakonda complete.");
    return;
  }

  simPanel.style.display = 'block';
  btn.textContent = '⏸️ Pause Simulation';
  speedEl.textContent = '78 km/h';
  startKeepAlive();

  currentSimTargetIndex = nextIdx;
  const startStop = temples[currentIdx];
  const endStop = temples[nextIdx];

  // Update toll tax display
  document.getElementById('gps-toll-tax').textContent = `₹${endStop.tollTax} (to ${endStop.name})`;

  simInterval = setInterval(() => {
    if (isSimulationPaused) return;

    simProgress += 2;
    fill.style.width = simProgress + '%';

    // Interpolate coordinates
    const ratio = simProgress / 100;
    const currentLat = startStop.lat + (endStop.lat - startStop.lat) * ratio;
    const currentLng = startStop.lng + (endStop.lng - startStop.lng) * ratio;
    coordsEl.textContent = `${currentLat.toFixed(4)}°, ${currentLng.toFixed(4)}°`;

    // Calculate nearest stop info
    const distLeft = endStop.distance - startStop.distance;
    const remainingDist = distLeft * (1 - ratio);
    nearestEl.textContent = `${endStop.name} (~${remainingDist.toFixed(1)} km)`;

    // Calculate active SVG marker coordinate coordinate
    const startPoint = svgPoints[Math.max(0, nextIdx - 1)];
    const endPoint = svgPoints[nextIdx];
    const currentCx = startPoint[0] + (endPoint[0] - startPoint[0]) * ratio;
    const currentCy = startPoint[1] + (endPoint[1] - startPoint[1]) * ratio;
    
    // Update Leaflet map marker coordinate (with rotation and auto-follow)
    updateCarMarkerPosition(currentLat, currentLng);

    // Save location for family sharing sync
    const locData = {
      lat: currentLat,
      lng: currentLng,
      nearest: endStop.name,
      distance: remainingDist,
      speed: '78',
      toll: endStop.tollTax,
      visitedIndex: nextIdx,
      progress: simProgress,
      timestamp: Date.now()
    };
    publishLiveLocation(locData);

    if (simProgress === 48) {
      // Trigger a Petrol Pump Stop simulation!
      isSimulationPaused = true;
      speedEl.textContent = '0 km/h';
      txt.textContent = 'Stopped at Highway Petrol Pump ⛽';
      window.showRefuelModal();
    } else if (simProgress >= 100) {
      // Arrived at destination!
      clearInterval(simInterval);
      simInterval = null;
      simProgress = 0;
      simPanel.style.display = 'none';
      btn.textContent = '🚗 Simulate Next Drive';
      speedEl.textContent = '0 km/h';
      stopKeepAlive();

      // Mark as current/visited
      temples.forEach((t, idx) => {
        if (idx < nextIdx) t.visited = true;
        if (idx === nextIdx) {
          t.current = true;
          t.visited = false;
        } else {
          t.current = false;
        }
      });
      saveTempleStates();

      // Show arrival notification
      alert(`🎉 You have arrived at ${endStop.name}!\nDeity: ${endStop.deity}\nSegment Toll Paid: ₹${endStop.tollTax}`);

      // Log Toll Tax automatically
      if (endStop.tollTax > 0) {
        expenseList.unshift({
          id: expenseList.length + 1,
          category: 'Other',
          paidBy: 'Pandu',
          description: `Toll Tax to ${endStop.name}`,
          amount: endStop.tollTax,
          date: new Date().toISOString().split('T')[0],
          temple: endStop.name
        });
        localStorage.setItem('yatra_expenses', JSON.stringify(expenseList));

        if (localStorage.getItem('yatra_app_role') !== 'family') {
          fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseList)
          }).catch(e => console.error("Error saving expense to server", e));
        }
      }

      // Update temple marker colors on map
      if (map) {
        temples.forEach((t, i) => {
          const isVisited = t.visited;
          const isCurrent = t.current;
          const markerColor = isCurrent ? '#9C27B0' : (isVisited ? '#4CAF50' : '#607D8B');
          if (templeMarkers[i]) {
            templeMarkers[i].setStyle({ fillColor: markerColor });
          }
        });
      }

      // Refresh page rendering
      renderRouteTimeline();
      renderTemples();
      renderExpenses();
      updateDashboardStats();
    } else {
      txt.textContent = `Driving to ${endStop.name}... ${simProgress}%`;
    }
  }, 300);
};

// ===== REFUEL MODAL =====
window.showRefuelModal = function() {
  document.getElementById('refuelLiters').value = '';
  document.getElementById('refuelTotal').value = '';
  document.getElementById('refuelLocation').value = temples[currentSimTargetIndex] 
    ? `HP Fuel Station, near ${temples[currentSimTargetIndex].name} highway`
    : 'Highway Petrol Pump';
  document.getElementById('refuelModal').style.display = 'flex';
};

window.closeRefuelModal = function() {
  document.getElementById('refuelModal').style.display = 'none';
  // If simulation was running, resume it
  isSimulationPaused = false;
  if (simInterval) {
    document.getElementById('gps-speed').textContent = '78 km/h';
  }
};

window.calcRefuelLiters = function() {
  const total = parseFloat(document.getElementById('refuelTotal').value) || 0;
  const rate = parseFloat(document.getElementById('refuelRate').value) || 0;
  if (rate > 0) {
    document.getElementById('refuelLiters').value = (total / rate).toFixed(2);
  } else {
    document.getElementById('refuelLiters').value = '';
  }
};

window.submitRefuelExpense = function() {
  const total = parseFloat(document.getElementById('refuelTotal').value);
  const rate = parseFloat(document.getElementById('refuelRate').value);
  const loc = document.getElementById('refuelLocation').value;
  const liters = parseFloat(document.getElementById('refuelLiters').value) || 0;
  const paidBy = document.getElementById('refuelPaidBy').value;

  if (!total || total <= 0 || !rate || rate <= 0) {
    alert('Please enter valid total cost and fuel rate.');
    return;
  }

  // Add fuel expense
  const newExp = {
    id: expenseList.length + 1,
    category: 'Fuel',
    paidBy: paidBy,
    description: `Refueled ${liters.toFixed(2)}L at ${loc}`,
    amount: Math.round(total),
    date: new Date().toISOString().split('T')[0],
    temple: temples[currentSimTargetIndex - 1]?.name || 'On Highway'
  };

  expenseList.unshift(newExp);
  localStorage.setItem('yatra_expenses', JSON.stringify(expenseList));

  if (localStorage.getItem('yatra_app_role') !== 'family') {
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseList)
    }).catch(e => console.error("Error saving expense to server", e));
  }

  renderExpenses();
  updateDashboardStats();
  window.closeRefuelModal();
};

// ===== PLACE DETAILS MODAL =====
window.showPlaceDetails = function(id) {
  const temple = temples.find(t => t.id === id);
  if (!temple) return;

  document.getElementById('place-detail-name').textContent = temple.name;
  document.getElementById('place-detail-deity').textContent = `Presiding Deity: ${temple.deity}`;
  document.getElementById('place-detail-emoji').textContent = temple.image;
  document.getElementById('place-detail-loc').textContent = temple.location;
  document.getElementById('place-detail-timing').textContent = temple.darshan;
  document.getElementById('place-detail-toll').textContent = `₹${temple.tollTax}`;
  document.getElementById('place-detail-desc').textContent = temple.significance;

  // Render weather
  const weatherCard = document.getElementById('place-detail-weather');
  if (weatherCard) {
    weatherCard.innerHTML = `
      <span class="pw-icon" style="font-size: 24px; animation: floatLockSymbols 2s ease-in-out infinite;">🌤️</span>
      <span class="pw-temp" style="font-family: 'Cinzel', serif; font-size: 14px; color: var(--text-muted);">Fetching...</span>
    `;
    
    fetchLiveWeather(temple.lat, temple.lng, temple.name).then(liveWeather => {
      weatherCard.innerHTML = `
        <span class="pw-icon" style="font-size: 32px;">${liveWeather.icon}</span>
        <span class="pw-temp" style="font-family: 'Cinzel', serif; font-size: 20px; font-weight: bold; color: var(--accent-gold);">${liveWeather.temp}°C</span>
        <span class="pw-desc" style="font-size: 11px; color: var(--text-muted); text-align: center;">${liveWeather.desc}</span>
      `;
    });
  }

  // Render attractions
  const attractionsGrid = document.getElementById('place-detail-attractions');
  if (temple.nearbyFamous && temple.nearbyFamous.length > 0) {
    attractionsGrid.innerHTML = temple.nearbyFamous.map(att => {
      // random mock distances for realistic premium aesthetic
      const mockDist = (Math.random() * 12 + 1).toFixed(1);
      return `
        <div class="attraction-item">
          <span style="font-size: 20px;">🏛️</span>
          <span class="attraction-item-name">${att}</span>
          <span class="attraction-item-dist">${mockDist} km away</span>
        </div>
      `;
    }).join('');
  } else {
    attractionsGrid.innerHTML = '<p style="font-size:12px;color:var(--text-muted);">No nearby attractions listed.</p>';
  }

  document.getElementById('placeDetailsModal').style.display = 'flex';
};

window.closePlaceDetails = function() {
  document.getElementById('placeDetailsModal').style.display = 'none';
};

// ===== SHARED GALLERY (FAMILY FOLDER) =====
const defaultMedia = [];

let pendingUploadFiles = [];

function initSharedGallery() {
  fetch('/api/gallery')
    .then(res => res.json())
    .then(data => {
      if (data && data.length > 0) {
        localStorage.setItem('yatra_gallery_media', JSON.stringify(data));
        renderGallery(data);
      } else {
        renderGallery([]);
      }
    })
    .catch(e => {
      console.error("Error fetching gallery, loading cached media", e);
      let cached = defaultMedia;
      try {
        const stored = localStorage.getItem('yatra_gallery_media');
        if (stored) {
          cached = JSON.parse(stored) || defaultMedia;
        }
      } catch (parseErr) {
        console.error("Error parsing cached gallery media:", parseErr);
      }
      renderGallery(cached);
    });
}

function renderGallery(list) {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  const role = localStorage.getItem('yatra_app_role') || 'driver';
  const isFamilyView = role === 'family';

  let mediaList = list;
  if (!mediaList) {
    mediaList = JSON.parse(localStorage.getItem('yatra_gallery_media')) || defaultMedia;
  }
  if (!Array.isArray(mediaList)) {
    mediaList = [];
  }

  if (mediaList.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:30px;">No shared media files yet. Upload photos from your temple visits!</p>';
    return;
  }

  // Group media by location into folders
  const folders = {};
  mediaList.forEach((item, originalIdx) => {
    const loc = item.location || 'General';
    if (!folders[loc]) folders[loc] = [];
    folders[loc].push({ ...item, _idx: originalIdx });
  });

  // Sort folder names: temple names first, General last
  const folderNames = Object.keys(folders).sort((a, b) => {
    if (a === 'General') return 1;
    if (b === 'General') return -1;
    return a.localeCompare(b);
  });

  let html = '';
  for (const folderName of folderNames) {
    const items = folders[folderName];
    const escapedName = folderName.replace(/'/g, "\\'");

    html += `
      <div class="gallery-folder">
        <div class="gallery-folder-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">📁</span>
            <h4>${folderName}</h4>
            <span class="folder-count">${items.length} file${items.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="gallery-folder-actions">
            <button class="btn-download-folder" onclick="window.downloadFolder('${escapedName}')">📥 Download Full Folder</button>
          </div>
        </div>
        <div class="gallery-folder-grid">
    `;

    for (const item of items) {
      let downloadHref = item.dataUrl;
      let downloadName = item.title;

      if (!downloadHref) {
        const mockText = `--- YOUNG BOYS Shared Media ---\nName: ${item.title}\nSize: ${item.size}`;
        const blob = new Blob([mockText], { type: 'text/plain' });
        downloadHref = URL.createObjectURL(blob);
        downloadName = item.title.includes('.') ? item.title.split('.')[0] + '.txt' : item.title + '.txt';
      }

      const preview = item.dataUrl && item.type === 'Photo'
        ? `<img src="${item.dataUrl}" class="gallery-img-preview" alt="${item.title}">`
        : `<span style="font-size: 36px;">${item.emoji}</span>`;

      const deleteBtnHtml = isFamilyView ? '' : `
        <button class="btn-sm" onclick="event.stopPropagation(); window.deleteGalleryItem(${item._idx})" style="padding:4px 8px;font-size:10px;background:rgba(244,67,54,0.12);color:#EF5350;border:1px solid rgba(244,67,54,0.3);border-radius:5px;cursor:pointer;flex:0 0 auto;">🗑️</button>
      `;

      html += `
        <div class="gallery-item" style="position:relative;">
          <div class="gallery-preview" onclick="window.openGalleryPreview(${item._idx})" style="cursor:pointer;">
            ${preview}
            <span class="gallery-type-badge">${item.type}</span>
          </div>
          <div class="gallery-info">
            <div class="gallery-title" title="${item.title}">${item.title}</div>
            <div class="gallery-meta">📅 ${item.date} · 💾 ${item.size}</div>
            <div style="display:flex;gap:6px;margin-top:4px;">
              <a href="${downloadHref}" download="${downloadName}" class="gallery-download-btn" style="flex:1;">📥 Download</a>
              ${deleteBtnHtml}
            </div>
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// Download entire folder as ZIP using JSZip
window.downloadFolder = async function(location) {
  const mediaList = JSON.parse(localStorage.getItem('yatra_gallery_media')) || [];
  const folderItems = mediaList.filter(item => (item.location || 'General') === location);

  if (folderItems.length === 0) {
    alert('No files in this folder to download.');
    return;
  }

  // Show progress
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = '⏳ Zipping...';
  btn.disabled = true;

  try {
    const zip = new JSZip();
    const folder = zip.folder(location);

    for (const item of folderItems) {
      if (item.dataUrl) {
        try {
          const response = await fetch(item.dataUrl);
          const blob = await response.blob();
          folder.file(item.title, blob);
        } catch (e) {
          console.error(`Failed to fetch ${item.title}`, e);
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${location}_Photos.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Error creating ZIP:', e);
    alert('Failed to create zip file. Please try downloading files individually.');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
};

window.deleteGalleryItem = function(index) {
  let mediaList = JSON.parse(localStorage.getItem('yatra_gallery_media')) || [];
  if (index < 0 || index >= mediaList.length) return;
  const item = mediaList[index];

  // Request passkey protection
  const pass = prompt(`Enter Gallery Delete Passkey to delete "${item.title}":`);
  if (pass === null) return; // User cancelled prompt
  if (pass !== '0206') {
    alert('❌ Invalid Delete Passkey. Action Denied.');
    return;
  }

  if (!confirm(`Are you sure you want to permanently delete "${item.title}"?`)) return;

  // If it has a server filename, tell server to delete it
  if (item.filename) {
    fetch('/api/gallery/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: item.filename })
    }).catch(e => console.error("Error deleting gallery item from server", e));
  }

  mediaList.splice(index, 1);
  localStorage.setItem('yatra_gallery_media', JSON.stringify(mediaList));
  renderGallery(mediaList);
};

// Gallery Upload with Location
window.handleGalleryUpload = function(event) {
  let selectedFiles = Array.from(event.target.files);
  if (selectedFiles.length === 0) return;

  if (selectedFiles.length > 20) {
    alert('⚠️ You can only select up to 20 files at a time.');
    event.target.value = '';
    return;
  }

  // Check for duplicates
  const mediaList = JSON.parse(localStorage.getItem('yatra_gallery_media')) || [];
  const duplicates = [];
  const uniqueFiles = [];

  for (const file of selectedFiles) {
    const isDup = mediaList.some(item => item.title === file.name);
    if (isDup) {
      duplicates.push(file.name);
    } else {
      uniqueFiles.push(file);
    }
  }

  if (duplicates.length > 0) {
    alert(`⚠️ The following files are already uploaded and will be skipped:\n\n${duplicates.join('\n')}`);
  }

  if (uniqueFiles.length === 0) {
    event.target.value = '';
    return;
  }

  pendingUploadFiles = uniqueFiles;

  // Calculate total size
  const totalSizeBytes = pendingUploadFiles.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);

  // Show preview in upload modal
  const preview = document.getElementById('uploadFilePreview');
  if (preview) {
    preview.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center;">
        <div>📁 <strong>${pendingUploadFiles.length} file${pendingUploadFiles.length > 1 ? 's' : ''} selected</strong></div>
        <div style="font-size:11px;color:var(--text-muted);">Total Size: ${totalSizeMB} MB</div>
        <div style="font-size:10px;color:var(--text-secondary);max-height:80px;overflow-y:auto;width:100%;margin-top:6px;padding:4px;background:rgba(0,0,0,0.2);border-radius:4px;">
          ${pendingUploadFiles.map(f => `• ${f.name}`).join('<br>')}
        </div>
      </div>
    `;
  }

  // Auto-select location based on current temple
  const currentTemple = temples.find(t => t.current);
  if (currentTemple) {
    const locSelect = document.getElementById('uploadLocation');
    if (locSelect) {
      const matchName = currentTemple.name.replace(' (Return)', '');
      for (let i = 0; i < locSelect.options.length; i++) {
        if (locSelect.options[i].value === matchName) {
          locSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Show upload modal
  document.getElementById('galleryUploadModal').style.display = 'flex';
};

window.closeUploadModal = function() {
  document.getElementById('galleryUploadModal').style.display = 'none';
  pendingUploadFiles = [];
  document.getElementById('gallery-upload-input').value = '';
};

window.confirmGalleryUpload = async function() {
  if (pendingUploadFiles.length === 0) {
    alert('No files selected.');
    return;
  }

  const location = document.getElementById('uploadLocation').value;
  const btnUpload = document.getElementById('btn-upload-media');
  const originalText = btnUpload ? btnUpload.textContent : '📤 Upload Media';

  // Close modal immediately
  document.getElementById('galleryUploadModal').style.display = 'none';

  if (btnUpload) {
    btnUpload.disabled = true;
  }

  let successCount = 0;
  const total = pendingUploadFiles.length;

  for (let i = 0; i < total; i++) {
    const file = pendingUploadFiles[i];
    if (btnUpload) {
      btnUpload.textContent = `⏳ Uploading ${i + 1} of ${total}...`;
    }

    const formData = new FormData();
    formData.append('media', file);
    formData.append('location', location);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        successCount++;
      } else {
        console.error(`Upload failed for ${file.name}:`, data.error);
      }
    } catch (err) {
      console.error(`Upload error for ${file.name}:`, err.message);
    }
  }

  // Reload gallery after all uploads complete
  try {
    const res = await fetch('/api/gallery');
    const mediaList = await res.json();
    localStorage.setItem('yatra_gallery_media', JSON.stringify(mediaList));
    renderGallery(mediaList);
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Error updating gallery after multiple uploads:", e.message);
  }

  if (btnUpload) {
    btnUpload.textContent = originalText;
    btnUpload.disabled = false;
  }

  alert(`✅ Successfully uploaded ${successCount} of ${total} files to 📁 ${location} folder!`);
  pendingUploadFiles = [];
  document.getElementById('gallery-upload-input').value = '';
};

// ===== GALLERY MEDIA PREVIEW =====
window.openGalleryPreview = function(originalIdx) {
  const mediaList = JSON.parse(localStorage.getItem('yatra_gallery_media')) || [];
  const item = mediaList[originalIdx];
  if (!item) return;

  const contentDiv = document.getElementById('galleryPreviewContent');
  const titleEl = document.getElementById('galleryPreviewTitle');
  const metaEl = document.getElementById('galleryPreviewMeta');

  if (titleEl) titleEl.textContent = item.title;
  if (metaEl) metaEl.textContent = `📍 Folder: ${item.location || 'General'}  ·  📅 Date: ${item.date}  ·  💾 Size: ${item.size}`;

  if (contentDiv) {
    if (item.type === 'Video') {
      contentDiv.innerHTML = `
        <video src="${item.dataUrl}" controls autoplay style="max-width: 100%; max-height: 60vh; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); outline: none;"></video>
      `;
    } else {
      contentDiv.innerHTML = `
        <img src="${item.dataUrl}" alt="${item.title}" style="max-width: 100%; max-height: 60vh; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
      `;
    }
  }

  // Configure download button in preview popup
  const downloadBtn = document.getElementById('galleryPreviewDownloadBtn');
  if (downloadBtn) {
    let downloadHref = item.dataUrl;
    let downloadName = item.title;

    if (!downloadHref) {
      const mockText = `--- YOUNG BOYS Shared Media ---\nName: ${item.title}\nSize: ${item.size}`;
      const blob = new Blob([mockText], { type: 'text/plain' });
      downloadHref = URL.createObjectURL(blob);
      downloadName = item.title.includes('.') ? item.title.split('.')[0] + '.txt' : item.title + '.txt';
    }

    downloadBtn.href = downloadHref;
    downloadBtn.download = downloadName;
  }

  const previewModal = document.getElementById('galleryPreviewModal');
  if (previewModal) previewModal.style.display = 'flex';
};

window.closeGalleryPreview = function() {
  const previewModal = document.getElementById('galleryPreviewModal');
  if (previewModal) previewModal.style.display = 'none';

  const contentDiv = document.getElementById('galleryPreviewContent');
  if (contentDiv) {
    const video = contentDiv.querySelector('video');
    if (video) video.pause();
    contentDiv.innerHTML = '';
  }
};

// ===== FAMILY REAL-TIME SHARING & VIEWER SYNC =====
window.copyShareLink = function() {
  const input = document.getElementById('share-link-input');
  input.select();
  input.setSelectionRange(0, 99999);
  
  navigator.clipboard.writeText(input.value)
    .then(() => {
      const btn = document.getElementById('btn-copy-share');
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = '📋 Copy Link', 2000);
    })
    .catch(err => {
      console.error(err);
      alert('Link: ' + input.value);
    });
};

function initFamilyShareAndTracking() {
  const shareLinkInput = document.getElementById('share-link-input');
  if (shareLinkInput) {
    shareLinkInput.value = window.location.origin + window.location.pathname + '?view=family-tracker';
  }

  const owntracksUrlLabel = document.getElementById('owntracks-url-label');
  if (owntracksUrlLabel) {
    owntracksUrlLabel.textContent = window.location.origin + '/api/location';
  }

  const params = new URLSearchParams(window.location.search);
  
  // Set role based on query param OR local storage role. Defaults to 'driver'
  let role = params.get('view') === 'family-tracker' ? 'family' : (localStorage.getItem('yatra_app_role') || 'driver');
  localStorage.setItem('yatra_app_role', role);

  const isFamilyView = role === 'family';

  // Toggle active class on header role buttons
  const btnDriverRole = document.getElementById('role-btn-driver');
  const btnFamilyRole = document.getElementById('role-btn-family');
  if (btnDriverRole && btnFamilyRole) {
    btnDriverRole.classList.toggle('active', !isFamilyView);
    btnFamilyRole.classList.toggle('active', isFamilyView);
    btnDriverRole.style.background = !isFamilyView ? 'rgba(212, 168, 67, 0.15)' : 'transparent';
    btnDriverRole.style.color = !isFamilyView ? 'var(--accent-gold)' : 'var(--text-secondary)';
    btnFamilyRole.style.background = isFamilyView ? 'rgba(212, 168, 67, 0.15)' : 'transparent';
    btnFamilyRole.style.color = isFamilyView ? 'var(--accent-gold)' : 'var(--text-secondary)';
  }

  // Initialize shared media folder
  initSharedGallery();

  if (isFamilyView) {
    // Show banner
    const banner = document.getElementById('family-viewer-banner');
    if (banner) banner.style.display = 'block';

    // Update GPS status panel badge
    const badge = document.getElementById('gps-status-badge');
    if (badge) {
      badge.textContent = 'Family Tracking Active';
      badge.className = 'badge badge-green';
    }

    // Hide controls on viewer end
    const btnToggle = document.getElementById('btn-toggle-gps');
    const btnSim = document.getElementById('btn-simulate-drive');
    const btnRefuel = document.getElementById('btn-simulate-refuel');
    if (btnToggle) btnToggle.style.display = 'none';
    if (btnSim) btnSim.style.display = 'none';
    if (btnRefuel) btnRefuel.style.display = 'none';

    // Hide upload button for family members
    const btnUpload = document.getElementById('btn-upload-media');
    if (btnUpload) btnUpload.style.display = 'none';

    // Hide expenses from family members for privacy
    const navBtnExp = document.getElementById('nav-btn-expenses');
    const statCardExp = document.getElementById('stat-card-expenses');
    const cardFuel = document.getElementById('card-fuel-estimation');
    const cardBreakdown = document.getElementById('card-expense-breakdown');
    const tabExp = document.getElementById('tab-expenses');
    if (navBtnExp) navBtnExp.style.display = 'none';
    if (statCardExp) statCardExp.style.display = 'none';
    if (cardFuel) cardFuel.style.display = 'none';
    if (cardBreakdown) cardBreakdown.style.display = 'none';
    if (tabExp) tabExp.style.display = 'none';

    // Show initial sync coordinate text
    document.getElementById('gps-coords').textContent = 'Waiting for coordinates...';
    document.getElementById('gps-nearest-stop').textContent = 'Connecting...';

    // Load initial storage location if available
    const stored = localStorage.getItem('yatra_live_location');
    if (stored) {
      try {
        updateViewerUI(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing yatra_live_location from storage", e);
      }
    }

    // Listen to storage events from the tracking tab (for local multi-tab sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'yatra_live_location' && e.newValue) {
        try {
          updateViewerUI(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'yatra_gallery_media') {
        renderGallery();
      }
      if (e.key === 'yatra_temple_states') {
        loadTempleStates();
        renderRouteTimeline();
        renderTemples();
        updateDashboardStats();
      }
      if (e.key === 'yatra_expenses') {
        loadExpenses();
        renderExpenses();
        updateDashboardStats();
      }
    });

    // Start active polling from the backend server for real-time remote device synchronization
    setInterval(() => {
      // 1. Poll live location coordinates
      fetch('/api/location')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("No location available");
        })
        .then(data => {
          updateViewerUI(data);
        })
        .catch(e => {});

      // 2. Poll temple states
      fetch('/api/temple-states')
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const cached = localStorage.getItem('yatra_temple_states');
            if (cached !== JSON.stringify(data)) {
              localStorage.setItem('yatra_temple_states', JSON.stringify(data));
              applyTempleStates(data);
              renderRouteTimeline();
              renderTemples();
              updateDashboardStats();
            }
          }
        })
        .catch(e => {});

      // 3. Poll expenses list
      fetch('/api/expenses')
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const cached = localStorage.getItem('yatra_expenses');
            if (cached !== JSON.stringify(data)) {
              localStorage.setItem('yatra_expenses', JSON.stringify(data));
              expenseList = data;
              renderExpenses();
              updateDashboardStats();
            }
          }
        })
        .catch(e => {});

      // 4. Poll gallery uploads
      fetch('/api/gallery')
        .then(res => res.json())
        .then(data => {
          const cached = localStorage.getItem('yatra_gallery_media');
          if (cached !== JSON.stringify(data)) {
            localStorage.setItem('yatra_gallery_media', JSON.stringify(data));
            renderGallery(data);
          }
        })
        .catch(e => {});
    }, 3000);
  } else {
    // Tracker mode: show share widget
    const shareSec = document.getElementById('share-link-section');
    if (shareSec) shareSec.style.display = 'block';

    // Explicitly restore controls and tabs hidden in family view
    const navBtnExp = document.getElementById('nav-btn-expenses');
    const statCardExp = document.getElementById('stat-card-expenses');
    const cardFuel = document.getElementById('card-fuel-estimation');
    const cardBreakdown = document.getElementById('card-expense-breakdown');
    const tabExp = document.getElementById('tab-expenses');
    if (navBtnExp) navBtnExp.style.display = '';
    if (statCardExp) statCardExp.style.display = '';
    if (cardFuel) cardFuel.style.display = '';
    if (cardBreakdown) cardBreakdown.style.display = '';
    if (tabExp) tabExp.style.display = '';

    const btnToggle = document.getElementById('btn-toggle-gps');
    const btnSim = document.getElementById('btn-simulate-drive');
    const btnRefuel = document.getElementById('btn-simulate-refuel');
    if (btnToggle) btnToggle.style.display = '';
    if (btnSim) btnSim.style.display = '';
    if (btnRefuel) btnRefuel.style.display = '';

    const btnUpload = document.getElementById('btn-upload-media');
    if (btnUpload) btnUpload.style.display = '';

    // Set initial map position for driver on start
    const stored = localStorage.getItem('yatra_live_location');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          updateCarMarkerPosition(parsed.lat, parsed.lng);
        }, 500);
      } catch (e) {
        console.error("Error parsing yatra_live_location for driver route", e);
      }
    }

    window.addEventListener('storage', (e) => {
      if (e.key === 'yatra_gallery_media') {
        renderGallery();
      }
      if (e.key === 'yatra_temple_states') {
        loadTempleStates();
        renderRouteTimeline();
        renderTemples();
        updateDashboardStats();
      }
      if (e.key === 'yatra_expenses') {
        loadExpenses();
        renderExpenses();
        updateDashboardStats();
      }
    });

    // Auto-resume GPS if it was previously active (e.g. app refreshed, or tab reloaded by OS background management)
    if (localStorage.getItem('yatra_gps_active') === 'true') {
      setTimeout(() => {
        if (!gpsWatchId) {
          console.log('Auto-resuming background GPS tracking...');
          window.toggleLiveGPS();
        }
      }, 1000);
    }
  }
}

window.setAppRole = function(newRole) {
  localStorage.setItem('yatra_app_role', newRole);
  // If switching to driver, clear unlock flag so passcode is required again
  if (newRole === 'driver') {
    localStorage.removeItem('yatra_portal_unlocked');
  }
  // Stop background tracking if moving away from driver mode
  if (newRole !== 'driver') {
    localStorage.setItem('yatra_gps_active', 'false');
    if (gpsWatchId) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
    }
  }
  // Reload cleanly to clear parameters and switch context
  window.location.href = window.location.origin + window.location.pathname;
};

function updateViewerUI(data) {
  if (!data || data.lat === undefined || data.lng === undefined) return;

  // Enrich minimal data formats (e.g. from background tracker) on the fly
  if (data.nearest === undefined || data.distance === undefined || data.visitedIndex === undefined) {
    let nearestStop = temples[0];
    let minDist = getDistanceKM(data.lat, data.lng, temples[0].lat, temples[0].lng);
    let nearestIdx = 0;
    
    for (let i = 1; i < temples.length; i++) {
      const dist = getDistanceKM(data.lat, data.lng, temples[i].lat, temples[i].lng);
      if (dist < minDist) {
        minDist = dist;
        nearestStop = temples[i];
        nearestIdx = i;
      }
    }
    
    data.nearest = nearestStop.name;
    data.distance = minDist;
    data.toll = nearestStop.tollTax;
    data.visitedIndex = nearestIdx;
    data.speed = data.speed !== undefined ? data.speed : 0;
  }

  // Save the latest enriched location to localStorage so map tab loads correctly
  localStorage.setItem('yatra_live_location', JSON.stringify(data));

  // 1. Update coordinates
  const coordsEl = document.getElementById('gps-coords');
  if (coordsEl) coordsEl.textContent = `${data.lat.toFixed(4)}°, ${data.lng.toFixed(4)}°`;

  // 2. Update speed
  const speedEl = document.getElementById('gps-speed');
  if (speedEl) speedEl.textContent = `${data.speed} km/h`;

  // 3. Update nearest stop
  const nearestEl = document.getElementById('gps-nearest-stop');
  if (nearestEl) nearestEl.textContent = `${data.nearest} (~${data.distance.toFixed(1)} km)`;

  // 4. Update next segment toll tax
  const tollEl = document.getElementById('gps-toll-tax');
  if (tollEl) {
    if (data.toll !== undefined) {
      tollEl.textContent = `₹${data.toll} (to ${data.nearest})`;
    }
  }

  // 5. Update Leaflet map car marker coordinate (with rotation and auto-follow)
  updateCarMarkerPosition(data.lat, data.lng);

  // 6. If coordinates sync, keep visited index and update timeline
  if (data.visitedIndex !== undefined) {
    const nextIdx = data.visitedIndex;
    temples.forEach((t, idx) => {
      if (idx < nextIdx) {
        t.visited = true;
        t.current = false;
      } else if (idx === nextIdx) {
        t.current = true;
        t.visited = false;
      } else {
        t.current = false;
        t.visited = false;
      }
    });
    // Trigger timeline refresh so the family member sees progress visually
    renderRouteTimeline();
    renderTemples();
    updateDashboardStats();
  }
  window.fetchAndRenderStops();
}

// ===== LEAFLET INTERACTIVE MAP INTEGRATION =====
let map = null;
let carMarker = null;
let templeMarkers = [];
let routePolyline = null;
let autoCenter = true;
let lastCoords = null;
let mapTileLayer = null;
let mapTheme = 'dark';
let stopMarkers = [];

// Calculate bearing between two points to rotate the car marker
function getBearing(lat1, lng1, lat2, lng2) {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

// Update the car marker on the map (handles position, bearing rotation, and auto-centering)
function updateCarMarkerPosition(lat, lng) {
  if (!map || !carMarker) return;

  // Calculate rotation bearing
  let bearing = 0;
  if (lastCoords) {
    bearing = getBearing(lastCoords.lat, lastCoords.lng, lat, lng);
  }

  // Avoid changing lastCoords if position hasn't changed
  if (lastCoords && lastCoords.lat === lat && lastCoords.lng === lng) {
    // Keep previous state
  } else {
    lastCoords = { lat, lng };
  }

  carMarker.setLatLng([lat, lng]);

  // Rotate the top-down car icon
  const carContainer = document.getElementById('map-car-icon-container');
  if (carContainer) {
    carContainer.style.transform = `rotate(${bearing}deg)`;
  }

  // Auto-centering and auto-zooming logic
  if (autoCenter) {
    if (map.getZoom() < 12) {
      map.setView([lat, lng], 13);
    } else {
      map.panTo([lat, lng]);
    }
  }
}

function updateStopMarkersOnMap(stopsList) {
  if (!map) return;

  // Clear existing stop markers
  stopMarkers.forEach(m => map.removeLayer(m));
  stopMarkers = [];

  // Add new stop markers
  stopsList.forEach(stop => {
    const displayLoc = stop.placeName || `${stop.lat.toFixed(4)}°, ${stop.lng.toFixed(4)}°`;
    
    // Create red circle marker representing the stop
    const marker = L.circleMarker([stop.lat, stop.lng], {
      radius: 6,
      fillColor: '#F44336',
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: 'Cinzel', serif; font-size: 11px;">
        <strong style="color: #F44336;">🛑 Vehicle Stop #${stop.id}</strong><br>
        <span style="color: #ccc; font-weight: bold;">Location:</span> <span style="color: #eee;">${displayLoc}</span><br>
        <span style="color: #ccc; font-weight: bold;">Duration:</span> <span style="color: #eee;">${stop.active ? 'Active Now ⏳' : `${stop.duration} mins`}</span>
      </div>
    `);

    stopMarkers.push(marker);
  });
}

// Recenter map camera onto the vehicle
window.recenterMap = function() {
  autoCenter = true;
  const btn = document.getElementById('btn-recenter');
  if (btn) btn.classList.remove('visible');

  if (map && carMarker) {
    const latlng = carMarker.getLatLng();
    map.setView(latlng, 13);
  }
};

function initLeafletMap() {
  const container = document.getElementById('mapContainer');
  if (!container) return;

  // Center on South India
  map = L.map('mapContainer').setView([12.5, 78.5], 6);

  // Set default theme from localStorage or default to 'dark'
  mapTheme = localStorage.getItem('yatra_map_theme') || 'dark';
  updateMapThemeLabel();

  const tileUrl = mapTheme === 'light' 
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  mapTileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Enable/disable recenter button on user interaction
  map.on('dragstart zoomstart', () => {
    autoCenter = false;
    const btn = document.getElementById('btn-recenter');
    if (btn) btn.classList.add('visible');
  });

  // Route points
  const routeCoords = temples.map(t => [t.lat, t.lng]);

  // Dash-styled route line
  routePolyline = L.polyline(routeCoords, {
    color: '#FF6B35',
    weight: 4,
    opacity: 0.8,
    dashArray: '8, 6'
  }).addTo(map);

  // Add temple markers with permanent tooltips
  temples.forEach((t, i) => {
    const isVisited = t.visited;
    const isCurrent = t.current;
    const markerColor = isCurrent ? '#9C27B0' : (isVisited ? '#4CAF50' : '#607D8B');

    const marker = L.circleMarker([t.lat, t.lng], {
      radius: isCurrent ? 9 : 6,
      fillColor: markerColor,
      color: '#fff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: 'Cinzel', serif; font-size: 11px;">
        <strong style="color: var(--accent-gold);">${i+1}. ${t.name}</strong><br>
        <span style="color: #ccc;">${t.deity}</span>
      </div>
    `);

    // Add permanent clean labels to the right of each temple (visible without clicking)
    marker.bindTooltip(`${t.name}`, {
      permanent: true,
      direction: 'right',
      className: 'temple-tooltip',
      offset: [10, 0]
    });
    
    templeMarkers.push(marker);
  });

  // Create customized pulsing live car marker
  const activeTemple = temples.find(t => t.current) || temples[0];
  let startLat = activeTemple.lat;
  let startLng = activeTemple.lng;
  const storedLoc = localStorage.getItem('yatra_live_location');
  let hasLiveLocation = false;
  if (storedLoc) {
    try {
      const parsed = JSON.parse(storedLoc);
      startLat = parsed.lat;
      startLng = parsed.lng;
      lastCoords = { lat: startLat, lng: startLng };
      hasLiveLocation = true;
    } catch(e) {}
  } else {
    lastCoords = { lat: startLat, lng: startLng };
  }

  // Premium top-down car icon HTML
  const carIconHtml = `
    <div class="custom-car-container" id="map-car-icon-container" style="transform: rotate(0deg);">
      <div class="car-glow-halo"></div>
      <svg class="topdown-car-svg" viewBox="0 0 50 100" width="30" height="50">
        <rect x="6" y="22" width="4" height="12" rx="2" fill="#1e3050" />
        <rect x="40" y="22" width="4" height="12" rx="2" fill="#1e3050" />
        <rect x="6" y="66" width="4" height="12" rx="2" fill="#1e3050" />
        <rect x="40" y="66" width="4" height="12" rx="2" fill="#1e3050" />
        <rect x="10" y="15" width="30" height="70" rx="15" fill="#FF6B35" />
        <rect x="13" y="35" width="24" height="35" rx="8" fill="#0d1829" />
        <path d="M 13 38 Q 25 30 37 38" stroke="#ECEFF1" stroke-width="3" fill="none" />
        <path d="M 15 67 Q 25 72 35 67" stroke="#ECEFF1" stroke-width="2" fill="none" />
        <ellipse cx="16" cy="18" rx="3" ry="2" fill="#FFE082" />
        <ellipse cx="34" cy="18" rx="3" ry="2" fill="#FFE082" />
        <rect x="13" y="81" width="5" height="2" fill="#E53935" />
        <rect x="32" y="81" width="5" height="2" fill="#E53935" />
      </svg>
    </div>
  `;

  carMarker = L.marker([startLat, startLng], {
    icon: L.divIcon({
      className: 'leaflet-car-marker-icon',
      html: carIconHtml,
      iconSize: [40, 60],
      iconAnchor: [20, 30]
    })
  }).addTo(map);

  // Focus on vehicle location if live location exists, otherwise show entire route bounds
  if (hasLiveLocation && autoCenter) {
    map.setView([startLat, startLng], 13);
  } else {
    map.fitBounds(routePolyline.getBounds(), { padding: [30, 30] });
  }

  // Draw vehicle stop markers on startup immediately
  window.fetchAndRenderStops();
}

window.toggleMapTheme = function() {
  if (!map) return;

  mapTheme = mapTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('yatra_map_theme', mapTheme);
  updateMapThemeLabel();

  if (mapTileLayer) {
    map.removeLayer(mapTileLayer);
  }

  const tileUrl = mapTheme === 'light' 
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' 
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  mapTileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);
};

function updateMapThemeLabel() {
  const label = document.getElementById('map-theme-label');
  if (label) {
    label.textContent = `Map Mode: ${mapTheme === 'dark' ? 'Dark' : 'Light'}`;
  }
}

// ===== PASSKEY PROTECTION SYSTEM =====
function initPasskeySystem() {
  const params = new URLSearchParams(window.location.search);
  const isFamilyLink = params.get('view') === 'family-tracker';
  const storedRole = localStorage.getItem('yatra_app_role');

  // Skip passcode lock overlay immediately for family tracking links
  if (isFamilyLink || storedRole === 'family') {
    const lockScreen = document.getElementById('lockScreen');
    if (lockScreen) {
      lockScreen.style.display = 'none';
    }
    // Do NOT set yatra_portal_unlocked for family — driver must always enter passcode
    return;
  }

  const isUnlocked = localStorage.getItem('yatra_portal_unlocked') === 'true';
  const lockScreen = document.getElementById('lockScreen');
  if (lockScreen) {
    if (isUnlocked) {
      lockScreen.style.display = 'none';
    } else {
      lockScreen.style.display = 'flex';
      // Show role selection first, hide passcode input
      const roleCard = document.getElementById('roleSelectionCard');
      const passkeyCard = document.getElementById('passkeyCard');
      if (roleCard) roleCard.style.display = 'block';
      if (passkeyCard) passkeyCard.style.display = 'none';
    }
  }
}

window.selectRole = function(role) {
  if (role === 'driver') {
    const roleCard = document.getElementById('roleSelectionCard');
    const passkeyCard = document.getElementById('passkeyCard');
    if (roleCard && passkeyCard) {
      roleCard.style.display = 'none';
      passkeyCard.style.display = 'block';
      setTimeout(() => {
        const input = document.getElementById('passkeyInput');
        if (input) {
          input.value = '';
          input.focus();
        }
      }, 100);
    }
  } else if (role === 'family') {
    window.setAppRole('family');
  }
};

window.backToRoleSelection = function() {
  const roleCard = document.getElementById('roleSelectionCard');
  const passkeyCard = document.getElementById('passkeyCard');
  if (roleCard && passkeyCard) {
    passkeyCard.style.display = 'none';
    roleCard.style.display = 'block';
  }
};

window.unlockApp = function() {
  const input = document.getElementById('passkeyInput');
  const errorEl = document.getElementById('lockError');
  if (!input) return;

  const code = input.value;
  if (code === '0105') {
    localStorage.setItem('yatra_portal_unlocked', 'true');
    const lockScreen = document.getElementById('lockScreen');
    if (lockScreen) {
      lockScreen.style.transition = 'opacity 0.4s ease';
      lockScreen.style.opacity = '0';
      setTimeout(() => {
        lockScreen.style.display = 'none';
      }, 400);
    }
    if (errorEl) errorEl.style.display = 'none';
  } else {
    if (errorEl) errorEl.style.display = 'block';
    input.value = '';
    input.focus();
    // Add visual shake effect on error
    const card = document.querySelector('.lock-card');
    if (card) {
      card.style.animation = 'lockShake 0.4s ease';
      setTimeout(() => card.style.animation = '', 400);
    }
  }
};

window.promptResetLock = function() {
  const modal = document.getElementById('resetModal');
  const input = document.getElementById('resetPasskeyInput');
  const errorEl = document.getElementById('resetError');
  if (modal) {
    modal.style.display = 'flex';
    if (input) {
      input.value = '';
      input.focus();
    }
    if (errorEl) errorEl.style.display = 'none';
  }
};

window.closeResetModal = function() {
  const modal = document.getElementById('resetModal');
  if (modal) modal.style.display = 'none';
};

window.submitResetLock = function() {
  const input = document.getElementById('resetPasskeyInput');
  const errorEl = document.getElementById('resetError');
  if (!input) return;

  const code = input.value;
  if (code === '2006') {
    // Reset temple states: Hanmakonda (id 1) is active/current, all others unvisited
    const resetState = temples.map((t, idx) => ({
      id: t.id,
      visited: false,
      current: idx === 0
    }));
    localStorage.setItem('yatra_temple_states', JSON.stringify(resetState));
    
    // Clear expenses list
    localStorage.setItem('yatra_expenses', JSON.stringify([]));
    
    // Reset live location back to Hanmakonda
    const startLoc = {
      lat: 17.9784,
      lng: 79.5941,
      nearest: "Hanmakonda",
      distance: 0,
      speed: "0",
      toll: 0,
      visitedIndex: 0,
      progress: 0,
      timestamp: Date.now()
    };
    localStorage.setItem('yatra_live_location', JSON.stringify(startLoc));

    // Clear lock status, role/gallery storage state, and GPS tracking state
    localStorage.removeItem('yatra_portal_unlocked');
    localStorage.removeItem('yatra_gallery_media');
    localStorage.removeItem('yatra_app_role');
    localStorage.removeItem('yatra_gps_active');
    localStorage.removeItem('yatra_offline_location_queue');

    // Wipe server data
    fetch('/api/reset', { method: 'POST' })
      .catch(e => console.error("Error resetting server state", e))
      .finally(() => {
        window.closeResetModal();
        window.location.href = window.location.origin + window.location.pathname;
      });
  } else {
    if (errorEl) errorEl.style.display = 'block';
    input.value = '';
    input.focus();
  }
};

// Add shake animation style keyframes programmatically to keep it self-contained
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes lockShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);
})();
