customElements.define("snap-ui", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" }).innerHTML = `
					<style>
					:host {
							box-sizing: border-box;
							display: block;
							margin: auto;
							padding: 10px;
							min-width: 280px;
							min-height: auto;
							background: #fff;
							font-size: 14px;
					}
					:host(.gui) {
							min-height: 550px;
					}
					:host(:not(.gui)) snap-header {
							display: none;
					}
					</style>

					<snap-header></snap-header>
					<slot></slot>
			`;
    }

    static get observedAttributes() {
        return ["contact", "gui"];
    }

    get contact() {
        return this.getAttribute("contact");
    }

    get gui() {
        return this.hasAttribute("gui");
    }

    set contact(name) {
        this.setAttribute("contact", name);
    }

    set gui(isGui) {
        if (isGui)
            this.setAttribute("gui", "");
        else
            this.removeAttribute("gui");
    }

    setContact(name) {
        const contactName = this.shadowRoot.querySelector("snap-header");
        contactName.textContent = name;
    }

    toggleGui() {
        if (this.gui)
            this.classList.add("gui");
        else
            this.classList.remove("gui");
    }

    connectedCallback() { }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "contact":
                this.setContact(this.contact);
                break;
            case "gui":
                this.toggleGui();
                break;
        }
    }
});

customElements.define("snap-header", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" }).innerHTML = `
					<style>
					:host {
							position: relative;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: space-between;
							margin: -10px -10px 10px -10px;
							padding: 0;
							width: calc(100% + 20px);
							height: 40px;
							background: rgb(0,195,255);
							font: 400 1.4em "Avenir Next", "Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif;
							color: #fff;
							text-align: center;
							pointer-events: none;
							-webkit-user-select: none;
							-moz-user-select: none;
							user-select: none;
					}
					:host::after {
							content: "";
							position: absolute;
							bottom: -5px;
							display: block;
							width: 100%;
							height: 5px;
							border-radius: 5px 5px 0 0;
							background: #fff;
							overflow: hidden;
					}
					svg {
							display: block;
							margin-left: 10px;
							width: 24px;
							height: 16px;
							fill: #fff;
					}
					svg line {
							stroke: #fff;
							stroke-width: 3px;
							stroke-linecap: round;
					}
					.arrow {
							position: relative;
							margin-right: 10px;
							width: 24px;
							text-align: right;
					}
					.arrow path {
							transform: rotate(22deg);
					}
					.arrow path + path {
							position: absolute;
							top: 10px;
							transform: rotate(-30deg);
					}
					</style>

					<svg viewBox="0 0 24 16" class="menu">
							<line x1="4" x2="20" y1="2" y2="2" />
							<line x1="4" x2="20" y1="8" y2="8" />
							<line x1="4" x2="20" y1="14" y2="14" />
					</svg>
					<div class="contact">
							<slot></slot>
					</div>
					<svg viewBox="0 0 12 17" class="arrow">
							<line x1="4" x2="10" y1="2" y2="8" />
							<line x1="4" x2="10" y1="14" y2="8" />
					</svg>
			`;
    }
});

customElements.define("snap-notice", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" }).innerHTML = `
					<style>
					:host {
							display: block;
							padding: 5px;
							text-align: center;
							color: var(--text-color, #888);
							font: 500 .7em "Avenir Next", "Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif;
							text-transform: uppercase;
							letter-spacing: 1px;
							background: var(--bg-text, transparent);
					}
					</style>

					<slot></slot>
			`;
    }
});

customElements.define("snap-message", class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" }).innerHTML = `
					<style>
					:host {
							font: 400 14px/20px "Avenir Next", "Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif;
							color: #222;
							--color-them: rgb(0,195,255);
							--color-me: rgb(255,48,54);
							--color-active: var(--color-me);
							/*--bg-name: transparent;*/
							/*--bg-text: transparent;*/
							/*--color-name: var(--color-active);*/
							/*--bg-text: transparent;*/
					}
					.name {
							display: block;
							margin: 5px 0 0;
							padding: 0;
							text-transform: uppercase;
							font-weight: 600;
							color: var(--color-name, var(--color-active));
							background: var(--bg-name, transparent);
					}
					.text {
							display: block;
							margin: 0;
							padding: 2px 0 4px 7px;
							border-left: 2px solid var(--color-active);
							background: var(--bg-text, transparent);
					}
					:host(.isSaved) .text {
							padding-left: 5px;
							border-left-width: 4px;
							border-radius: 3px;
							background: var(--bg-saved, #eee);
					}
					:host(.isSaved.isFollower) .text {
							border-top-left-radius:0;
							border-top-right-radius:0;
					}
					:host(.isFollower) .name {
							display: none;
					}
					:host(.hasFollower) .text {
							border-bottom-left-radius: 0;
							border-bottom-right-radius: 0;
					}
					::slotted(img) {
							display: block;
							max-width: 100%;
							border-radius: 2px;
					}
					</style>

					<span class="name"></span>
					<div class="text"><slot></slot></div>
			`;
    }

    static get observedAttributes() {
        return ["from", "saved"];
    }

    get from() {
        return this.getAttribute("from");
    }

    get saved() {
        return this.hasAttribute("saved");
    }

    set from(name) {
        this.setAttribute("from", name);
    }

    set saved(isSaved) {
        if (isSaved)
            this.setAttribute("saved", "");
        else this.removeAttribute("saved");
    }

    manageChainedMessages() {

        let previousEl = this.previousElementSibling;

        if (previousEl == null) {
            this.classList.remove("isFollower");
        } else {//(previousEl != null)
            if (previousEl.from == this.from) {
                this.classList.add("isFollower");
                previousEl.classList.add("hasFollower");
            } else {//(previousEl && previousEl.from != this.from)
                this.classList.remove("isFollower");
                previousEl.classList.remove("hasFollower");
            }
        }

        let nextEl = this.nextElementSibling;

        if (nextEl == null) {
            this.classList.remove("hasFollower");
        } else {//(nextEl != null)
            if (nextEl.from == this.from) {
                this.classList.add("hasFollower");
                nextEl.classList.add("isFollower");
            } else {//(nextEl && nextEl.from != this.from)
                this.classList.remove("hasFollower");
                nextEl.classList.remove("isFollower");
            }
        }
    }

    setColor(from) {
        const color = from.toLowerCase() == "me" ? "me" : "them";
        const cssColor = `var(--color-${color})`;
        this.style.setProperty("--color-active", cssColor);
    }

    markSaved() {
        if (this.saved)
            this.classList.add("isSaved");
        else this.classList.remove("isSaved");
    }

    connectedCallback() {
        if (!this.from || this.from.toLowerCase() == "me")
            this.from = "Me";

        const name = this.shadowRoot.querySelector(".name");
        name.textContent = this.from;

        this.manageChainedMessages();

        this.addEventListener("refreshMessageOrder", this.manageChainedMessages);
    }

    disconnectedCallback() {
        this.removeEventListener("refreshMessageOrder", this.manageChainedMessages);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "from":
                this.setColor(this.from);
                break;
            case "saved":
                this.markSaved();
                break;
        }
    }
});