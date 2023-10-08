/* OPTIONS MENU */

const sidebar = document.getElementById('sidebar');

/* SLIDERS */

const tempSlider = document.getElementById("tempSlider");
const tempSliderValue = document.getElementById("tempValue");
// Update the span element with the initial slider value
tempSliderValue.innerHTML = tempSlider.value;

const tokenSlider = document.getElementById("tokenSlider");
const tokenSliderValue = document.getElementById("tokenValue");
tokenSliderValue.innerHTML = tokenSlider.value;

const accuracySlider = document.getElementById("accuracySlider");
const accuracyValue = document.getElementById("accuracyValue");
accuracyValue.innerHTML = accuracySlider.value;

// Add an event listener to update the span element when the slider value changes
tempSlider.addEventListener("input", function() {
    tempSliderValue.innerHTML = this.value;
});

tokenSlider.addEventListener("input", function() {
    tokenSliderValue.innerHTML = this.value;
});

accuracySlider.addEventListener("input", function() {
    accuracyValue.innerHTML = this.value;
});

/* TEXTAREAS */
const textSettings = document.getElementById("settings-text");


 /* UPDATE STATUS TEXT */
const updateStatusText = document.getElementById("update-status");

function toggleOptionsMenu() {
    sidebar.classList.remove('hide-options');
    sidebar.classList.add('show-options');
}

function hideOptionsMenu() {
    sidebar.classList.remove('show-options');
    sidebar.classList.add('hide-options');
    updateStatusText.innerHTML = "";
}

function updateSettings() {

    
    var temperature = tempSliderValue.innerHTML;
    var tokens = tokenSliderValue.innerHTML;
    var accuracy = accuracyValue.innerHTML;
    var newSettings = {
        "text": textSettings.value,
        "temperature": temperature,
        "tokens": tokens,
        "accuracy": accuracy
    };
    if(textSettings.value != "") {
        textSettings.value = "";
    }
    sendSettings(newSettings);
}

function sendSettings(settingsValues) {
    fetch('/update_settings/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Use your CSRF token here
        },
        body: JSON.stringify({ value: settingsValues }),
    })
    .then(response => response.json())
    .then(response => {
        // Handle the response from the server if needed
        updateStatus(response.update_status);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateStatus(status) {
    if(status) {
        updateStatusText.style.color = "#86B686";
        updateStatusText.innerHTML = "Settings updated";

    } else {
        updateStatusText.style.color = "#B68686";
        updateStatusText.innerHTML = "Update failed";
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}