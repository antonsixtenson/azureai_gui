
const userInput = document.getElementById("userInput");
const mainContainer = document.getElementById("main-container");
const messageContainer = document.getElementById("message-container");
const bottomInputContainer = document.getElementById("bottomInputContainer");

userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
    bottomInputContainer.style.height = userInput.scrollHeight + 40 + "px";
});

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitQuestion();
    }
});

function copyCode(codeText) {
    const textArea = document.createElement("textarea");
    textArea.value = codeText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

function submitQuestion() {
    var inputValue = userInput.value;
    if(inputValue != ""){
        const messageBox = document.createElement("pre");
        messageBox.className = "question-box";
        messageBox.textContent = inputValue
        messageContainer.appendChild(messageBox);
        userInput.value = "";
    }

    fetch('/analyze/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Include CSRF token for security
        },
        body: JSON.stringify({ user_input: inputValue }),
    })
    .then(response => response.json())
    .then(data => {
        // Update the header message with the response from the server
        addReply(data.reply);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    scrollToBottom();
}

// Helper function to get the CSRF token from cookies
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

function scrollToBottom() {
    mainContainer.scrollTop = mainContainer.scrollHeight;
}

function generateResponseElem(data, messageBox) {

    const codeBlockRegex = /([\s\S]*?)```(\w+)\s*([^]+?)```([\s\S]*)/g; // Updated regex
    var match;
    var lang;
    var langClass;
    var beforeCode;
    var code;
    var afterCode;

    // Find code in response from LLM
    while ((match = codeBlockRegex.exec(data)) !== null) {
        beforeCode = match[1].trim();
        lang = match[2];
        langClass = "language-" + lang;
        code = match[3];
        afterCode = match[4].trim();
    }

    // If there are text before the code -- add it to element
    if(beforeCode) {
        addText(beforeCode, messageBox);
    }

    // If there are code in the response -- format and add it
    if(code) {
        addFormattedCode(langClass, code, messageBox);
    }

    // If there are text after the code -- parse it again
    if(afterCode) {
        generateResponseElem(afterCode, messageBox);
    }

    if (! beforeCode && ! code && ! afterCode) {
        const messageBox = document.createElement("div");
        messageBox.className = "message-box";
        messageBox.textContent = data;

        messageContainer.appendChild(messageBox);
    }

    Prism.highlightAll();
    scrollToBottom();
    userInput.value = "";
    userInput.style.height = "auto";
    bottomInputContainer.style.height = "60px";
}

function addFormattedCode(lang, code, messageBox) {
    const codeHeader = document.createElement("div");
    codeHeader.className = "code-header";
    const codeText = document.createElement("div");
    codeText.className = "code-text";
    codeText.textContent = lang.substring(9);
    const copyCodeButton = document.createElement("button");
    copyCodeButton.className = "copy-button";
    // Create an <img> element for the custom icon
    const customIcon = document.createElement("img");
    customIcon.className = "copy-icon";
    customIcon.src = staticImageUrl; // Replace with the path to your custom .png file
    customIcon.alt = " "; // Optional: Provide an alternative text for accessibility
            // Create a <span> element for the "Copy Code" text
    const copyCodeText = document.createElement("span");
    copyCodeText.textContent = "Copy Code";
    
    // Add a click event listener to copy the code
    copyCodeButton.addEventListener("click", () => {
        copyCode(code);
    });
    // Append the clipboard icon and text to the copyCodeButton
    copyCodeButton.appendChild(customIcon);
    copyCodeButton.appendChild(copyCodeText);
    codeHeader.appendChild(codeText);
    codeHeader.appendChild(copyCodeButton);
    const codeBox = document.createElement("div");
    codeBox.className = "code-box";
    const preWrapper = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.className = lang;
    codeElement.innerHTML = code;
    codeBox.appendChild(codeHeader);
    preWrapper.appendChild(codeElement);
    codeBox.appendChild(preWrapper);
    messageBox.appendChild(codeBox);
    messageContainer.appendChild(messageBox);
}

function addText(text, messageBox) {
    const textAfterCodeElement = document.createElement("div");
    textAfterCodeElement.className = "text-response";
    textAfterCodeElement.textContent = text;
    messageBox.appendChild(textAfterCodeElement);
}

function addReply(messageText) {

    // Create div for the response
    const messageBox = document.createElement("div");
    messageBox.className = "message-box";

    generateResponseElem(messageText, messageBox);
}