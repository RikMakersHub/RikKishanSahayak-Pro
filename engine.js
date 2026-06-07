// --- 1. FULL REGIONAL ARCHITECTURE MATRIX ---
const stateMandiNetwork = {
    "West Bengal": [
        { name: "Siliguri Mandi", distance_km: 560, diesel_per_km: 14, tolls: 850 },
        { name: "Kharagpur Mandi", distance_km: 125, diesel_per_km: 12, tolls: 240 },
        { name: "Burdwan Mandi", distance_km: 95, diesel_per_km: 12, tolls: 160 },
        { name: "Kolkata Mandi", distance_km: 15, diesel_per_km: 8, tolls: 0 }
    ],
    "Bihar": [
        { name: "Purnia Mandi", distance_km: 310, diesel_per_km: 12, tolls: 420 },
        { name: "Bhagalpur Mandi", distance_km: 230, diesel_per_km: 12, tolls: 310 },
        { name: "Muzaffarpur Mandi", distance_km: 75, diesel_per_km: 10, tolls: 90 },
        { name: "Patna Mandi", distance_km: 20, diesel_per_km: 8, tolls: 0 }
    ],
    "Uttar Pradesh": [
        { name: "Agra Mandi", distance_km: 340, diesel_per_km: 13, tolls: 520 },
        { name: "Varanasi Mandi", distance_km: 320, diesel_per_km: 13, tolls: 480 },
        { name: "Kanpur Mandi", distance_km: 90, diesel_per_km: 11, tolls: 120 },
        { name: "Lucknow Mandi", distance_km: 35, diesel_per_km: 9, tolls: 40 }
    ],
    "Maharashtra": [
        { name: "Nagpur Mandi", distance_km: 810, diesel_per_km: 15, tolls: 1200 },
        { name: "Nashik Mandi", distance_km: 180, diesel_per_km: 12, tolls: 340 },
        { name: "Pune Mandi", distance_km: 145, diesel_per_km: 11, tolls: 260 },
        { name: "Vashi APMC Mumbai", distance_km: 40, diesel_per_km: 8, tolls: 100 }
    ],
    "Punjab": [
        { name: "Amritsar Mandi", distance_km: 140, diesel_per_km: 12, tolls: 180 },
        { name: "Patiala Mandi", distance_km: 95, diesel_per_km: 10, tolls: 110 },
        { name: "Jalandhar Mandi", distance_km: 60, diesel_per_km: 10, tolls: 70 },
        { name: "Ludhiana Mandi", distance_km: 25, diesel_per_km: 9, tolls: 0 }
    ],
    "Assam": [
        { name: "Dibrugarh Mandi", distance_km: 440, diesel_per_km: 13, tolls: 610 },
        { name: "Silchar Mandi", distance_km: 330, diesel_per_km: 14, tolls: 720 },
        { name: "Jorhat Mandi", distance_km: 310, diesel_per_km: 12, tolls: 400 },
        { name: "Guwahati Mandi", distance_km: 30, diesel_per_km: 8, tolls: 50 }
    ]
};

// Programmatic baseline scaling depending on harvest commodity selections
const baselineCropMultipliers = {
    "Potato": 1.0,
    "Onion": 1.3,
    "Rice": 1.8,
    "Wheat": 1.6
};

function updateMandiOptions() {
    runArbitrageEngine();
}

// --- 2. THE MATHEMATICAL ARBITRAGE COMPUTATION ALGORITHM ---
function runArbitrageEngine() {
    const state = document.getElementById("stateSelect").value;
    const crop = document.getElementById("cropSelect").value;
    const weight = parseFloat(document.getElementById("produceWeight").value) || 0;
    const dieselPrice = parseFloat(document.getElementById("dieselPrice").value) || 0;

    document.getElementById("currentStateBadge").innerText = state;

    const mandis = stateMandiNetwork[state];
    const multiplier = baselineCropMultipliers[crop];
    let computationalReport = [];

    mandis.forEach((mandi, index) => {
        // Generates programmatic baseline market rates scaled across geographic arrays
        let customRate = Math.round((2200 + (index * 350)) * multiplier);
        
        let grossRevenue = weight * customRate;
        let fuelNeededLiters = mandi.distance_km / mandi.diesel_per_km;
        let totalFuelCost = Math.round(fuelNeededLiters * dieselPrice);
        
        // Comprehensive roundtrip + toll calculations
        let totalTransportCost = (totalFuelCost * 2) + mandi.tolls;
        let netProfit = grossRevenue - totalTransportCost;

        computationalReport.push({
            name: mandi.name,
            distance: mandi.distance_km,
            rate: customRate,
            gross: grossRevenue,
            transport: totalTransportCost,
            net: netProfit
        });
    });

    // Sort descending layout matching top yield parameters
    computationalReport.sort((a, b) => b.net - a.net);
    renderDashboard(computationalReport, crop);
}

// --- 3. DYNAMIC DOM INJECTION AND UI RE-RENDERING ENGINE ---
function renderDashboard(data, currentCrop) {
    const winner = data[0];
    const winnerTarget = document.getElementById("winnerData");
    const alternativesTarget = document.getElementById("alternativesList");

    // Dynamic Winner Update with RikKishan System Identification Rules
    winnerTarget.innerHTML = `
        <div class="winner-layout">
            <div class="winner-title-area">
                <span style="font-family: monospace; font-size: 0.75rem; text-transform: uppercase; color: #10b981; font-weight: bold; background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 4px;">RikKishan Optimal Target</span>
                <h3>${winner.name}</h3>
                <p>Commodity Profile: <strong style="color: #cbd5e1;">${currentCrop}</strong> | Vector: <strong>${winner.distance} km</strong></p>
            </div>
            <div class="payout-metric-box">
                <span class="payout-label">Net Return Yield</span>
                <span class="payout-value">₹${winner.net.toLocaleString('en-IN')}</span>
            </div>
        </div>
        <div class="math-breakdown-grid">
            <div>
                <span class="math-label">Gross Crop Payout</span>
                <span class="math-val">₹${winner.gross.toLocaleString('en-IN')}</span>
                <span style="color: #64748b; font-size: 11px; display: block;">(Current Rate: ₹${winner.rate}/Qtl)</span>
            </div>
            <div>
                <span class="math-label">Infrastructure Drag</span>
                <span class="math-loss">- ₹${winner.transport.toLocaleString('en-IN')}</span>
                <span style="color: #64748b; font-size: 11px; display: block;">(Transit Fuel + Tolls)</span>
            </div>
        </div>
    `;

    // Dynamic Alternative Layout Generator
    alternativesTarget.innerHTML = "";
    if (data.length > 1) {
        for (let i = 1; i < data.length; i++) {
            const item = data[i];
            const lossAmount = winner.net - item.net;
            
            alternativesTarget.innerHTML += `
                <div class="alternative-item">
                    <div>
                        <h4 class="alt-title">${item.name} <span>(${item.distance} km)</span></h4>
                        <p class="alt-risk">⚠️ Revenue Leak: ₹${lossAmount.toLocaleString('en-IN')} vs Optimal Vector</p>
                    </div>
                    <div class="alt-right">
                        <span class="alt-profit">₹${item.net.toLocaleString('en-IN')}</span>
                        <span class="alt-rate">Mandi Rate: ₹${item.rate}/Qtl</span>
                    </div>
                </div>
            `;
        }
    } else {
        alternativesTarget.innerHTML = `<p style="font-family: monospace; font-size: 12px; color: #64748b; font-style: italic;">No alternative profiles mapped.</p>`;
    }
}

// System execution start
window.onload = runArbitrageEngine;
