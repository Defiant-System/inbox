
let lorem1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let lorem2 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

let Test = {
	init(APP) {

		// let dirty = "";
		// let tmp = DOMPurify.sanitize(dirty);
		// console.log(tmp);

		// console.log( DOMPurify.sanitize('<s onclick="alert(1)">hello</s>') );


		// let cssString = `h1, h2 { color: red; } .class-name, #id > p { font-size: 16px; } .parent .child { margin: 20px; }`;
		// CssSelectors.constrain(".banana", cssString);


		return;

		// return setTimeout(() => {
		// 	let el = window.find(`list .list-entry:nth-child(1)`);
		// 	APP.list.dispatch({ type: "menu-delete-list-entry", el });
		// }, 400);


		return setTimeout(() => window.find(`list .list-entry`).get(3).trigger("click"), 600);
		// return setTimeout(() => window.find(`sidebar .folder-entry:nth(1)`).trigger("click"), 300);

		// return setTimeout(() => APP.blankView.els.layout.find(`.btn[data-click="init-demo-data"]`).trigger("click"), 200);

		// setTimeout(() => APP.content.els.el.find(`.mail-entry`).get(1).trigger("click"), 400);
		// return setTimeout(() => window.find(`list .list-entry:nth(2)`).trigger("click"), 300);

		// // Undo delete
		// setTimeout(() => APP.content.els.el.find(`.btn-undo`).trigger("click"), 900);
		// return setTimeout(() => window.find(`list .list-entry:nth(2)`).trigger("click"), 300);


		// // Delete (expanded or not)
		// setTimeout(() => APP.content.els.el.find(`.mail-entry[data-id="11024"]`).addClass("expanded"), 500);
		// setTimeout(() => {
		// 	// let el = APP.content.els.el.find(`.mail-entry.active`);
		// 	let el = APP.content.els.el.find(`.mail-entry[data-id="11024"] span[data-menu="mail-actions"]`);
		// 	APP.content.dispatch({ type: "menu-delete-mail", el });
		// }, 900);
		// return setTimeout(() => window.find(`list .list-entry:nth(2)`).trigger("click"), 300);


		// return setTimeout(() => {
		// 	APP.toolbar.els.btnReply.trigger("click");
		// 	// APP.list.dispatch({ type: "check-for-new-mail" });
		// }, 500);


		/*
		let Spawn = this.spawn || window.open("new-mail");
		// return;
		setTimeout(() => {
			let el = Spawn.find(`input[name="mail-to"]`),
				recipient = { name: "Hakan Bilgin", address: "mr.hakan.bilgin@gmail.com" };
			APP.newMail.dispatch({ type: "add-recipient", el, recipient });

			// el = Spawn.find(`input[name="mail-cc"]`);
			// recipient = { address: "hbi99@hotmail.com" };
			// APP.newMail.dispatch({ type: "add-recipient", el, recipient });

			// el = Spawn.find(`input[name="mail-bcc"]`);
			// recipient = { address: "mr.hakan.bilgin@gmail.com" };
			// APP.newMail.dispatch({ type: "add-recipient", el, recipient });

			// el.val("mo");
			// Spawn.find(`input[name="mail-to"]`).val("hbi99@hotmail.com");
			// Spawn.find(`input[name="mail-to"]`).val("hbi@longscript.com");
			// let rcpt = $(`<span class="from recipient" data-address="hbi@longscript.com">Hakan Bilgin</span>`);
			// Spawn.find(`input[name="mail-to"]`).before(rcpt);

			Spawn.find(`input[name="mail-subject"]`).val("kube-system");
			Spawn.find(`div.mail-message`).html(`This is the thread root.<br/><br/>-H`);
			// Spawn.find(`div.mail-message`).html(`Testing this mail <br/><b>with rich</b> text....<br/><br/>${lorem1}`);
			// Spawn.find(`.toolbar-tool_[data-click="send-mail"]`).trigger("click");

			// setTimeout(() => Spawn.find(`label.hidden`).removeClass("hidden"), 200);
			// setTimeout(() => Spawn.find(`label:nth(0) i[data-arg="priority"]`).trigger("click"), 200);
			// setTimeout(() => Spawn.find(`.toolbar-tool_[data-click="add-attachment"]`).trigger("click"), 500);
			// setTimeout(() => el.focus(), 500); // .trigger("keydown")
		}, 200);
		*/
	},
	runTestData(APP) {
		// if not already parsed
		if (!window.bluePrint.selectNodes(`//TempThread//mail/excerpt`).length) {
			// put lorem ipsum text into test mail body
			window.bluePrint.selectNodes(`//TempThread//mail/html`).map(xHtml => {
				let html = xHtml.textContent;
				let xExcerpt = $.nodeFromString(`<excerpt><![CDATA[${html}]]></excerpt>`);
				xExcerpt = xHtml.parentNode.appendChild(xExcerpt);
				// add random mail content
				let oddEven = Math.random() * 2 | 0 > 0;
				xHtml.textContent = `${html}<br><br/>${oddEven ? lorem1 : lorem2}`;
			});
		}
		APP.list.dispatch({ type: "render-temp-list", fId: 2001 });
		APP.list.els.el.find(`.list-entry`).get(0).trigger("click");

		setTimeout(() => APP.sidebar.els.el.find(`.folder-entry`).get(0).addClass("active"), 300);
	}
};
