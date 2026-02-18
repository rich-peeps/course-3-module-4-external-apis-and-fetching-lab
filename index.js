// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

document.addEventListener("DOMContentLoaded", () => {
    const inputEl = document.getElementById("state-input");
    const fetchBtn = document.getElementById("fetch-alerts");
    const displayEl = document.getElementById("alerts-display");
    const errorEl = document.getElementById("error-message");
 
    async function fetchWeatherAlerts(state) {
        const abbr = state.trim().toUpperCase();
        const url = `https://api.weather.gov/alerts/active?area=${abbr}`;
        const res = await fetch(url);
        const data = await res.json();
        return { data, abbr };
    }  
    function displayAlerts(data, abbr) {
        clearError();
        clearDisplay();       
        const count = data.features.length;
        const summary = document.createElement('p');
        summary.textContent = `Weather Alerts: ${count}`;
        displayEl.appendChild(summary);
        const list = document.createElement('ul');
        data.features.forEach((feature) => {
            const headline = feature?.properties?.headline || feature?.properties?.event || 'Untitled alert';
            const li = document.createElement('li');
            li.textContent = headline;
            list.appendChild(li);
        });
        displayEl.appendChild(list);
    }
    async function handleFetch(event) {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        clearError();
        clearDisplay();
        const stateVal = inputEl ? inputEl.value : '';
        try {
        const { data, abbr } = await fetchWeatherAlerts(stateVal);
        displayAlerts(data, abbr);
        if (inputEl) inputEl.value = '';
        } catch (err) {
        showError(err.message || 'An unknown error occurred.');
        }
    }    
    function showError(message) {
        if (!errorEl) return;
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
    function clearError() {
        if (!errorEl) return;
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }
    function clearDisplay() {
        if (!displayEl) return;
        displayEl.innerHTML = '';
    }
    if (fetchBtn) fetchBtn.addEventListener('click', handleFetch);
    if (inputEl) inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleFetch(e);
    });
});