
// inbox.blankView

{
	init() {
		this.els = {
			layout: window.find("layout"),
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.blankView,
			el;
		// console.log(event);
		switch (event.type) {
			case "render-blank-view":
				// init toolbar depending on user
				APP.toolbar.dispatch({ type: "init-view" });
				APP.toolbar.dispatch({ type: "mail-selected" });
				// hide sidebar + list column
				Self.els.layout.removeClass("show-sidebar show-list");
				// render blank view
				window.render({
					template: "blank-view",
					match: `//Data`,
					target: Self.els.content
				});
				break;
			case "open-filesystem":
				karaqu.shell("fs -o ~/Mail/");
				break;
			case "new-mail":
				APP.toolbar.els.btnNewMail.trigger("click");
				break;
			case "init-demo-data":
				APP.demoView = true;
				// init test data
				Test.runTestData(APP);
				// enable toolbar for demo use
				APP.toolbar.dispatch({ type: "init-demo-data" });
				// render tree view
				window.render({
					template: "sidebar-entries",
					match: `//Data/Mailbox`,
					target: APP.sidebar.els.el
				});
				// show sidebar + list column
				Self.els.layout.addClass("show-sidebar show-list");
				break;
			case "register-account":
				karaqu.shell("sys -x");
				break;
		}
	}
}
