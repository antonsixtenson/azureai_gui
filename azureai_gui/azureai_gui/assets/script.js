const userInput = document.getElementById("userInput");
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
        submitMessage();
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

function submitMessage() {
    const messageText = userInput.value;
    const codeStart = "[CODE-START]";
    const codeEnd = "[CODE-END]";

    if (messageText.includes(codeStart) && messageText.includes(codeEnd)) {
        const messageBox = document.createElement("div");
        messageBox.className = "message-box";

        const codeSegment = messageText.split(codeStart)[1].split(codeEnd);
        const codeSection = codeSegment[0].trim();

        const codeBox = document.createElement("div");
        codeBox.className = "code-box";

        const codeHeader = document.createElement("div");
        codeHeader.className = "code-header";

        const codeText = document.createElement("div");
        codeText.className = "code-text";
        codeText.textContent = "code";

        const copyCodeButton = document.createElement("button");
        copyCodeButton.className = "copy-button";

        // Create an <img> element for the custom icon
        const customIcon = document.createElement("img");
        customIcon.className = "copy-icon";
        customIcon.src = "{% static 'copy.png' %}"; // Replace with the path to your custom .png file
        customIcon.alt = "Copy Code"; // Optional: Provide an alternative text for accessibility

        
        // Create a <span> element for the "Copy Code" text
        const copyCodeText = document.createElement("span");
        copyCodeText.textContent = "Copy Code";
        
        // Add a click event listener to copy the code
        copyCodeButton.addEventListener("click", () => {
            copyCode(codeSection);
        });

        // Append the clipboard icon and text to the copyCodeButton
        copyCodeButton.appendChild(customIcon);
        copyCodeButton.appendChild(copyCodeText);

        codeHeader.appendChild(codeText);
        codeHeader.appendChild(copyCodeButton);

        codeBox.appendChild(codeHeader);

        const codeTextContent = document.createElement("div");
        codeTextContent.textContent = codeSection;
        codeBox.appendChild(codeTextContent);

        const textBeforeCode = messageText.split(codeStart)[0];
        const textAfterCode = codeSegment[1].trim();
        messageBox.textContent = textBeforeCode;
        messageBox.appendChild(codeBox);

        if (textAfterCode) {
            const textAfterCodeElement = document.createElement("div");
            textAfterCodeElement.className = "text-after-code";
            textAfterCodeElement.textContent = textAfterCode;
            messageBox.appendChild(textAfterCodeElement);
        }

        messageContainer.appendChild(messageBox);
    } else {
        const messageBox = document.createElement("div");
        messageBox.className = "message-box";
        messageBox.textContent = messageText;

        messageContainer.appendChild(messageBox);
    }

    userInput.value = "";
    userInput.style.height = "auto";
    bottomInputContainer.style.height = "60px";
}