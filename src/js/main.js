
@import "modules/test.js"


const mail = {
	init() {
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		// temp
		// setTimeout(() => this.dispatch({ type: "new-mail" }), 250);
		// setTimeout(() => $(".mail-body").focus(), 350);
		setTimeout(() => {
			// let win = $(`.ant-window_[data-id="mail-new-mail"]`);
			// el.trigger("mousedown");
			// karaqu_.window_.close_(win)

			// window.close();
			window.focus();
		}, 600);
	},
	dispatch(event) {
		let Self = mail,
			name,
			value,
			pEl,
			el;
		// proxy newMail (spawn) events
		if (event.spawn) return Self.newMail.dispatch(event);
		// console.log(event);
		switch (event.type) {
			case "window.init":
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
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
	newMail: @import "modules/newMail.js",
};

window.exports = mail;
