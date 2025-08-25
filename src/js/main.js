
@import "modules/test.js"


// fetch bundled code
const {
	ICAL,
	PostalMime,
} = await window.fetch("~/js/bundle.js");

// user details
const ME = karaqu.user;

const inbox = {
	init() {
		// fast references
		this.xData = window.bluePrint.selectSingleNode("//Data");

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		// init settings
		this.dispatch({ type: "init-settings" });

		// init sidebar content
		this.sidebar.dispatch({ type: "init-render" });

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = inbox,
			el;
		// proxy newMail (spawn) events
		if (event.spawn) return Self.newMail.dispatch(event);
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.init":
			case "window.focus":
			case "window.blur":
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			case "init-settings":
				break;
			// proxy events
			case "check-for-new-mail":
				// this event was triggered by system/socket-io
				return Self.list.dispatch(event);
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						if (!name) name = pEl.data("show");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	// shell exposed methods: START
	writeMailTo(mail) {
		// open new spawn & insert email addres
		let Spawn = window.open("new-mail");
		Spawn.find(`input[name="mail-to"]`).val(mail);
	},
	// shell exposed methods: END
	toolbar: @import "areas/toolbar.js",
	sidebar: @import "areas/sidebar.js",
	list: @import "areas/list.js",
	content: @import "areas/content.js",
	newMail: @import "areas/new-mail.js",
};

window.exports = inbox;
