
let test = {
	init() {
		// setTimeout(() => this.newMail(), 300);
		// setTimeout(() => this.list(), 200);
		// setTimeout(() => this.sidebar(), 200);
		// setTimeout(() => this.content(), 200);
	},
	newMail() {
		let Spawn = this.spawn || window.open("new-mail");

		setTimeout(() => {
			Spawn.find(`input[name="mail-to"]`).val("hbi99@hotmail.com");
			Spawn.find(`input[name="mail-subject"]`).val("Writing the subject of the e-mail");
			Spawn.find(`div.mail-message`).html(`Testing this mail <br/><b>with rich</b> text....`);
		}, 200);

		// setTimeout(() => {
		// 	Spawn.find(`.toolbar-tool_[data-click="send-mail"]`).trigger("click");
		// }, 400);
	},
	sidebar() {
		mail.sidebar.els.el.find(".list-wrapper:nth(1) .entry:nth(0)").trigger("click");
	},
	list() {
		// mail.list.els.el.find(".entry:nth(1)").trigger("click");
		// setTimeout(() => mail.list.dispatch({ type: "prepend-mail" }), 500);
	},
	content() {
		// mail.content.dispatch({ type: "render-mail-thread", eml: "~/sample/hotmail-1.eml" });
		// mail.content.els.el.find(".entry").get(0).trigger("click");
		// this.els.el.find(".wrapper .icon-thick-messages").trigger("click");
	}
};
// auto init
test.init();
