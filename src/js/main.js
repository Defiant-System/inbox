
@import "classes/graph.js"
@import "modules/test.js"


// fetch bundled code
const {
	ICAL,
	PostalMime,
} = await window.fetch("~/js/bundle.js");


const defaultSettings = {
	sidebar: { show: true, folder: 2001, },
	list: { show: true },
	content: { show: true },
};


// user details
const ME = karaqu.user;
if (ME.username === "demo") defaultSettings.content.show = "blank-view";


const inbox = {
	init() {
		// fast references
		this.xData = window.bluePrint.selectSingleNode("//Data");
		// put username to ledger data
		// this.xData.setAttribute("user", "demo");
		this.xData.setAttribute("user", ME.username);

		// init settings
		this.dispatch({ type: "init-settings" });

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

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
				if (ME.username === "demo") {
					Self.settings = defaultSettings;
				} else {
					// get settings, if any
					Self.settings = window.settings.getItem("settings") || defaultSettings;
				}
				break;
			case "show-start-view":
				return Self.content.dispatch({ type: "render-blank-view" });
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
	blankView: @import "areas/blank-view.js",
};

window.exports = inbox;
