// =============================================
// Task 1: JavaScript Basics & Setup
// =============================================
console.log("Welcome to the Community Portal");

// =============================================
// Task 2: Syntax, Data Types, and Operators
// =============================================
const eventName = "Music Festival 2026";
const eventDate = "2026-07-15";
let seats = 50;

const eventInfo = `Event: ${eventName} | Date: ${eventDate} | Seats Available: ${seats}`;
console.log(eventInfo);

function registerSeat() {
    if (seats > 0) {
        seats--;
        console.log(`Seat registered. Remaining: ${seats}`);
    } else {
        console.log("No seats available.");
    }
}

function cancelSeat() {
    seats++;
    console.log(`Seat cancelled. Remaining: ${seats}`);
}

// =============================================
// Task 3: Conditionals, Loops, and Error Handling
// =============================================
const events = [
    { id: 1, name: "Music Festival",    category: "Music",   date: "2026-07-15", seats: 30, fee: 100 },
    { id: 2, name: "Annual Food Fair",  category: "Food",    date: "2026-08-10", seats: 0,  fee: 150 },
    { id: 3, name: "Community Sports",  category: "Sports",  date: "2025-03-01", seats: 20, fee: 200 },
    { id: 4, name: "Tree Plantation",   category: "Eco",     date: "2026-09-05", seats: 15, fee: 0   },
    { id: 5, name: "Book Exhibition",   category: "Culture", date: "2026-10-20", seats: 40, fee: 50  },
    { id: 6, name: "Cultural Night",    category: "Culture", date: "2026-11-12", seats: 25, fee: 75  },
];

const today = new Date();

function isUpcomingWithSeats(event) {
    const eventDateTime = new Date(event.date);
    return eventDateTime >= today && event.seats > 0;
}

function displayEvents(list) {
    const container = document.getElementById("eventContainer");
    if (!container) return;
    container.innerHTML = "";

    list.forEach(event => {
        if (isUpcomingWithSeats(event)) {
            const card = createEventCard(event);
            container.appendChild(card);
        } else {
            const card = createEventCard(event, true);
            container.appendChild(card);
        }
    });
}

function registerUserForEvent(eventId) {
    try {
        const event = events.find(e => e.id === eventId);
        if (!event) throw new Error("Event not found.");
        if (event.seats <= 0) throw new Error("No seats available for this event.");
        const eventDate2 = new Date(event.date);
        if (eventDate2 < today) throw new Error("Cannot register for past events.");
        event.seats--;
        displayEvents(events);
        showToast(`Registered for "${event.name}"! Seats left: ${event.seats}`);
    } catch (err) {
        showToast(`Error: ${err.message}`, true);
    }
}

// =============================================
// Task 4: Functions, Scope, Closures, Higher-Order Functions
// =============================================
function addEvent(name, category, date, seats, fee) {
    const newEvent = {
        id: events.length + 1,
        name, category, date, seats, fee
    };
    events.push(newEvent);
    displayEvents(events);
    return newEvent;
}

function registerUser(eventId) {
    registerUserForEvent(eventId);
}

function filterEventsByCategory(category, callback) {
    return events.filter(e => callback(e, category));
}

// Closure: track total registrations per category
function createRegistrationTracker() {
    const counts = {};
    return {
        register(category) {
            counts[category] = (counts[category] || 0) + 1;
        },
        getCount(category) {
            return counts[category] || 0;
        },
        getAll() {
            return { ...counts };
        }
    };
}
const tracker = createRegistrationTracker();

// =============================================
// Task 5: Objects and Prototypes
// =============================================
function Event(id, name, category, date, seats, fee) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.date = date;
    this.seats = seats;
    this.fee = fee;
}

Event.prototype.checkAvailability = function () {
    const d = new Date(this.date);
    if (d < today) return "Past event";
    if (this.seats <= 0) return "Fully booked";
    return `${this.seats} seats available`;
};

const sampleEvent = new Event(99, "Demo Event", "Music", "2026-12-01", 10, 100);
console.log("Event entries:", Object.entries(sampleEvent));
console.log("Availability:", sampleEvent.checkAvailability());

// =============================================
// Task 6: Arrays and Methods
// =============================================
function addNewEvent(event) {
    events.push(event);
}

function getMusicEvents() {
    return events.filter(e => e.category === "Music");
}

function formatEventCards() {
    return events.map(e => `Workshop on ${e.name}`);
}

console.log("Music Events:", getMusicEvents());
console.log("Formatted Cards:", formatEventCards());

// =============================================
// Task 7: DOM Manipulation
// =============================================
function createEventCard(event, disabled = false) {
    const card = document.createElement("div");
    card.className = "eventCard" + (disabled ? " disabled-card" : "");
    card.dataset.eventId = event.id;

    const eventDate2 = new Date(event.date);
    const isPast = eventDate2 < today;
    const isFull = event.seats <= 0;
    const statusText = isPast ? "Past" : isFull ? "Full" : "Open";
    const statusClass = isPast ? "status-past" : isFull ? "status-full" : "status-open";

    card.innerHTML = `
        <div class="card-header">
            <span class="event-category">${event.category}</span>
            <span class="event-status ${statusClass}">${statusText}</span>
        </div>
        <h3 class="event-name">${event.name}</h3>
        <p class="event-date">📅 ${event.date}</p>
        <p class="event-seats">🪑 ${event.seats} seats</p>
        <p class="event-fee">💰 ${event.fee === 0 ? "Free" : "₹" + event.fee}</p>
        <button class="register-btn" onclick="registerUser(${event.id})" ${(isPast || isFull) ? "disabled" : ""}>
            ${(isPast || isFull) ? (isPast ? "Past Event" : "Fully Booked") : "Register"}
        </button>
    `;
    return card;
}

// =============================================
// Task 8: Event Handling
// =============================================
function setupEventHandlers() {
    // onchange: filter events by category
    const catFilter = document.getElementById("categoryFilter");
    if (catFilter) {
        catFilter.addEventListener("change", function () {
            const val = this.value;
            if (!val) {
                displayEvents(events);
            } else {
                const filtered = filterEventsByCategory(val, (e, cat) => e.category === cat);
                const container = document.getElementById("eventContainer");
                if (!container) return;
                container.innerHTML = "";
                filtered.forEach(e => container.appendChild(createEventCard(e)));
            }
        });
    }

    // keydown: search by name
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keydown", function () {
            setTimeout(() => {
                const query = this.value.toLowerCase();
                const filtered = events.filter(e => e.name.toLowerCase().includes(query));
                const container = document.getElementById("eventContainer");
                if (!container) return;
                container.innerHTML = "";
                filtered.forEach(e => container.appendChild(createEventCard(e)));
            }, 0);
        });
    }
}

// =============================================
// Task 9: Async JS, Promises, Async/Await
// =============================================
function fetchEventsMock() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(events), 800);
    });
}

// Using .then() / .catch()
function loadEventsWithPromise() {
    showSpinner(true);
    fetchEventsMock()
        .then(data => {
            displayEvents(data);
            showSpinner(false);
        })
        .catch(err => {
            console.error("Failed to load events:", err);
            showSpinner(false);
        });
}

// Using async/await
async function loadEventsAsync() {
    showSpinner(true);
    try {
        const data = await fetchEventsMock();
        displayEvents(data);
    } catch (err) {
        console.error("Failed to load events:", err);
    } finally {
        showSpinner(false);
    }
}

function showSpinner(show) {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = show ? "block" : "none";
}

// =============================================
// Task 10: Modern JavaScript Features
// =============================================
function formatEvent({ name, category, date, seats = 0, fee = 0 } = {}) {
    return `[${category}] ${name} — ${date} | Seats: ${seats} | Fee: ${fee === 0 ? "Free" : "₹" + fee}`;
}

function cloneAndFilter(category) {
    const cloned = [...events]; // spread operator
    return cloned.filter(e => e.category === category);
}

// =============================================
// Task 11: Working with Forms
// =============================================
function setupRegistrationForm() {
    const form = document.getElementById("registrationForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const elements = form.elements;
        const name  = elements["regName"].value.trim();
        const email = elements["regEmail"].value.trim();
        const event = elements["regEvent"].value;
        const date  = elements["regDate"].value;
        const msg   = elements["regMessage"].value.trim();

        // Inline validation
        clearErrors(form);
        let valid = true;

        if (!name)  { showError("regName",    "Name is required.");    valid = false; }
        if (!email) { showError("regEmail",   "Email is required.");   valid = false; }
        if (!event) { showError("regEvent",   "Please select an event."); valid = false; }
        if (!date)  { showError("regDate",    "Please select a date."); valid = false; }
        if (!msg)   { showError("regMessage", "Message is required."); valid = false; }

        if (valid) {
            tracker.register(event);
            const output = form.querySelector("output");
            if (output) output.value = `✅ Registration submitted for "${event}"! Thank you, ${name}.`;
            submitToMockAPI({ name, email, event, date, message: msg });
        }
    });
}

function showError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    const err = document.createElement("span");
    err.className = "field-error";
    err.textContent = message;
    field.parentNode.insertBefore(err, field.nextSibling);
}

function clearErrors(form) {
    form.querySelectorAll(".field-error").forEach(el => el.remove());
}

// =============================================
// Task 12: AJAX & Fetch API
// =============================================
async function submitToMockAPI(data) {
    const statusEl = document.getElementById("apiStatus");
    if (statusEl) statusEl.textContent = "Submitting...";

    try {
        // Simulate delayed mock POST
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock fetch (would be real URL in production):
        // const res = await fetch("https://mockapi.io/register", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(data)
        // });

        console.log("Mock POST payload:", data);
        if (statusEl) {
            statusEl.textContent = "✅ Registration sent to server!";
            statusEl.className = "api-success";
        }
        showToast("Registration sent successfully!");
    } catch (err) {
        if (statusEl) {
            statusEl.textContent = "❌ Submission failed. Please try again.";
            statusEl.className = "api-error";
        }
        showToast("Submission failed.", true);
    }
}

// =============================================
// Task 13: Debugging — console logging helpers
// =============================================
function logFormSubmission(data) {
    console.group("Form Submission Debug");
    console.log("Name:", data.name);
    console.log("Email:", data.email);
    console.log("Event:", data.event);
    console.log("Date:", data.date);
    console.log("Fetch Payload:", JSON.stringify(data));
    console.groupEnd();
}

// =============================================
// Task 14: jQuery — used in HTML via CDN
// (See index.html for $('#registerBtn').click etc.)
// =============================================

// =============================================
// Helpers
// =============================================
function showToast(message, isError = false) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = "toast show" + (isError ? " toast-error" : "");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// =============================================
// Init
// =============================================
window.addEventListener("load", function () {
    alert("Welcome to the Community Portal!");
    setupEventHandlers();
    setupRegistrationForm();
    loadEventsAsync();

    // jQuery (Task 14): fadeIn/fadeOut and click handler
    if (typeof $ !== "undefined") {
        $("#registerBtn").click(function () {
            showToast("Register button clicked via jQuery!");
        });
        $(".eventCard").fadeIn(600);
    }
});
