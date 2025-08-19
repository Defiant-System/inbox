
// email.toolbar

{
	init() {
		this.els = {
			layout: window.find("layout"),
			btnTrash: window.find(`.toolbar-tool_[data-click="delete-mail"]`),
			btnArchive: window.find(`.toolbar-tool_[data-click="arhive-mail"]`),
			btnJunk: window.find(`.toolbar-tool_[data-click="junk-mail"]`),
			btnReply: window.find(`.toolbar-tool_[data-click="reply-mail"]`),
			btnReplyAll: window.find(`.toolbar-tool_[data-click="reply-all-mail"]`),
			btnforward: window.find(`.toolbar-tool_[data-click="forward-mail"]`),
		};
	},
	dispatch(event) {
		let APP = email,
			Self = APP.toolbar,
			activeMail,
			isOn,
			el;
		switch (event.type) {
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				return !isOn;
			case "send-receive":
				APP.list.dispatch({ type: "check-for-new-mail" });
				break;
			case "new-mail":
				window.open("new-mail");
				break;
			case "delete-mail":
				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				APP.list.dispatch({ type: "put-mail-in-folder", id: activeMail.id, fId: 2005, el: activeMail.listEl });
				break;
			case "junk-mail":
				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				APP.list.dispatch({ type: "put-mail-in-folder", id: activeMail.id, fId: 2003, el: activeMail.listEl });
				break;
			case "mail-selected":
				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				// console.log( activeMail );
				// update toolbar
				Self.els.btnTrash.toggleClass("tool-disabled_", activeMail.el.length);
				Self.els.btnJunk.toggleClass("tool-disabled_", activeMail.el.length);
				
				Self.els.btnReply.toggleClass("tool-disabled_", activeMail.el.length);
				Self.els.btnReplyAll.toggleClass("tool-disabled_", activeMail.el.length);
				Self.els.btnforward.toggleClass("tool-disabled_", activeMail.el.length);
				break;
		}
	}
}
