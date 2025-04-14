class TaskHintManager
{
    constructor (options)
    {
        this.container = options.container;
        this.hintsInputElement = options.hintsInputElement;
        this.hints = [];
    }

    constructHintElements()
    {
        this.container.innerHTML = "";

        const hintsContainer = document.createElement('div');
        hintsContainer.classList.add('hints_container');
        hintsContainer.setAttribute("id", "hints_container");

        const hintsHeader = document.createElement('h3');
        hintsHeader.textContent = "Hints";
        hintsContainer.appendChild(hintsHeader);

        const hintsListContainer = document.createElement('div');
        hintsListContainer.classList.add("hints_list_container");
        hintsListContainer.setAttribute("id", "hints_list_container");
        hintsContainer.appendChild(hintsListContainer);

        const addHintButton = document.createElement('button');
        addHintButton.type = "button";
        addHintButton.classList.add("add_hint_btn");
        addHintButton.setAttribute("id", "add_hint_btn");
        addHintButton.innerHTML = "&#x2795;";

        addHintButton.addEventListener("click", () => {
            this.hints.push("");
            this.renderHints();
        });

        hintsContainer.appendChild(addHintButton);
        this.container.appendChild(hintsContainer);
    }

    updateHintsInputElement()
    {
        this.hintsInputElement.value = JSON.stringify(this.hints.filter(hint => hint !== ""));
    }

    renderHints()
    {
        const hintsListContainer = document.getElementById("hints_list_container");
        hintsListContainer.innerHTML = "";

        this.hints.forEach((hint, index) => {
            const hintDiv = document.createElement("div");
            hintDiv.classList.add("hint_item");

            const hintInput = document.createElement("input");
            hintInput.type = "text";
            hintInput.value = hint;
            hintInput.placeholder = "Hint...";
            hintInput.addEventListener("input", (event) => {
                this.hints[index] = event.target.value;
                this.updateHintsInputElement();
            });

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove_hint_btn");
            removeButton.innerHTML = "&#128465;";
            removeButton.type = "button";
            removeButton.addEventListener("click", () => {
                this.hints.splice(index, 1);
                this.renderHints();
                this.updateHintsInputElement();
            });

            hintDiv.appendChild(hintInput);
            hintDiv.appendChild(removeButton);
            hintsListContainer.appendChild(hintDiv);
        });

        this.updateHintsInputElement();
    }
}