
const mail = {
	init() {
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		// temp
		setTimeout(() => this.dispatch({ type: "new-mail" }), 250);
		setTimeout(() => $(".mail-body").focus(), 350);
	},
	dispatch(event) {
		let Self = mail,
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			case "window.init":
				break;
			case "open-help":
				defiant.shell("fs -u '~/help/index.md'");
				break;

			case "spawn.open":
			case "spawn.close":
				// console.log(event);
				break;
			case "send-mail":
				console.log("close window");
				break;
			case "toggle-field":
				// cc
				// bcc
				// reply-to
				// priority
				console.log(event);
				break;
			case "add-attachment":
				console.log(event);
				break;

			case "toggle-sidebar":
				return Self.sidebar.dispatch(event);
			case "new-mail":
				window.open("new-mail");
				break;
			default:
				if (event.el) {
					pEl = event.el.data("area") ? event.el : event.el.parents(`[data-area]`);
					if (pEl.length) {
						name = pEl.data("area");
						Self[name].dispatch(event);
					}
				}
		}
	},
	list: @import "modules/list.js",
	sidebar: @import "modules/sidebar.js",
	content: @import "modules/content.js",
};

window.exports = mail;
