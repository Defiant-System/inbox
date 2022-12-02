
let test = {
	init() {
		setTimeout(() => this.list(), 200);
		// setTimeout(() => this.sidebar(), 200);
		setTimeout(() => this.content(), 200);
	},
	list() {
		mail.list.els.el.find(".entry:nth(0)").trigger("click");

		// setTimeout(() => mail.list.dispatch({ type: "prepend-mail" }), 500);
	},
	sidebar() {
		mail.sidebar.els.el.find(".list-wrapper:nth(1) .entry:nth(0)").trigger("click");
	},
	content() {
		mail.content.dispatch({ type: "load-mail" });
		// mail.content.els.el.find(".entry").get(0).trigger("click");
		// this.els.el.find(".wrapper .icon-thick-messages").trigger("click");
	}
};
// auto init
test.init();
