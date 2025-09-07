
// inbox.toolbar

{
	init() {
		this.els = {
			layout: window.find("layout"),
			btnSidebar: window.find(`.toolbar-tool_[data-click="toggle-sidebar"]`),
			btnSendReceive: window.find(`.toolbar-tool_[data-click="send-receive"]`),
			btnNewMail: window.find(`.toolbar-tool_[data-click="new-mail"]`),

			btnTrash: window.find(`.toolbar-tool_[data-click="delete-mail"]`),
			btnArchive: window.find(`.toolbar-tool_[data-click="arhive-mail"]`),
			btnJunk: window.find(`.toolbar-tool_[data-click="junk-mail"]`),
			btnReply: window.find(`.toolbar-tool_[data-click="reply-mail"]`),
			btnReplyAll: window.find(`.toolbar-tool_[data-click="reply-all-mail"]`),
			btnforward: window.find(`.toolbar-tool_[data-click="forward-mail"]`),
		};
	},
	dispatch(event) {
		let APP = inbox,
			Self = APP.toolbar,
			spawn,
			activeMail,
			isOn,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-view":
				isOn = ME.username === "demo";
				Self.els.btnSidebar.toggleClass("tool-disabled_", !isOn);
				Self.els.btnSendReceive.toggleClass("tool-disabled_", !isOn);
				Self.els.btnNewMail.toggleClass("tool-disabled_", !isOn);
				break;
			case "init-demo-data":
				Self.els.btnSidebar.removeClass("tool-disabled_").addClass("tool-active_");
				Self.els.btnSendReceive.removeClass("tool-disabled_");
				Self.els.btnNewMail.removeClass("tool-disabled_");
				break;
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				// update settings
				APP.settings.sidebar.show = !isOn;
				// return boolen for sys UI
				return !isOn;
			case "send-receive":
				APP.list.dispatch({ type: "check-for-new-mail" });
				break;
			case "new-mail":
				spawn = window.open("new-mail");
				setTimeout(() => spawn.find(`input[name="mail-to"]`).focus(), 100);
				break;
			case "delete-mail":
				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				APP.list.dispatch({ type: "put-mail-in-folder", id: activeMail.id, fId: 2005, el: activeMail.listEl });
				break;
			case "junk-mail":
				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				APP.list.dispatch({ type: "put-mail-in-folder", id: activeMail.id, fId: 2003, el: activeMail.listEl });
				break;
			case "archive-mail":
				// TODO
				break;
			case "reply-mail":
			case "reply-all-mail":
			case "forward-mail":
				spawn = window.open("new-mail");
				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				APP.dispatch({ ...event, spawn, activeMail });
				break;
			case "mail-selected":
				// skip if demo account
				if (ME.username === "demo") return;

				activeMail = APP.content.dispatch({ type: "get-active-mail" });
				isOn = activeMail.id !== "welcome" && activeMail.el.length;
				// update toolbar
				Self.els.btnTrash.toggleClass("tool-disabled_", isOn);
				Self.els.btnJunk.toggleClass("tool-disabled_", isOn);
				
				Self.els.btnReply.toggleClass("tool-disabled_", isOn);
				Self.els.btnReplyAll.toggleClass("tool-disabled_", isOn);
				Self.els.btnforward.toggleClass("tool-disabled_", isOn);
				break;
		}
	}
}
