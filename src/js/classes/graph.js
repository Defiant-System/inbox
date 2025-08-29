
class Graph {
	constructor(xRoot) {
		this.thread = new Map();
		// sort nodes on date
		let xList = xRoot.selectNodes(`../mail`)
				.sort((a,b) => {
					let aDate = a.selectSingleNode("./date").getAttribute("value"),
						bDate = b.selectSingleNode("./date").getAttribute("value");
					return aDate.localeCompare(bDate);
				});
		// this actualy change node order index
		xList.map((x,i) => x.parentNode.insertBefore(x, x.parentNode.childNodes[i]));
		// recursive map
		this.mapXml(xRoot);
		// save reference to root node
		this.xRoot = xRoot;
		// traverse map & get lanes
		let mId = xRoot.selectSingleNode(`./tags/i[@id="messageId"]`).getAttribute("value");
		this.setLanes(mId);
	}

	mapXml(xMail) {
		let aId = xMail.selectSingleNode(`./tags/i[@id="messageId"]`).getAttribute("value");
		let xReplied = xMail.selectNodes(`../mail/tags/i[@id="inReplyTo"][@value="${aId}"]`);
		
		for (let i=0, il=xReplied.length; i<il; i++) {
			let bId = xReplied[i].selectSingleNode(`../i[@id="messageId"]`).getAttribute("value");
			this.addEdge(aId, bId);
			// recursively go deeper
			this.mapXml(xReplied[i].parentNode.parentNode);
		}
	}

	addEdge(node1, node2) {
		let set = this.thread.get(node1);
		if (set == null) this.thread.set(node1, new Set([node2]));
		else set.add(node2);
	}

	getAdjacencies(node) {
		return this.thread.get(node) ?? new Set();
	}

	setLanes(node) {
		// data topology
		let topology = [];
		let exclude = [];
		for (let path of this.juntions(node)) {
			topology.unshift(path.join("/"));
		}
		// console.log(topology);

		// extract lanes from topology
		let lanes = [];
		topology.map(p => {
			if (!lanes.find(e => e.startsWith(p))) lanes.push(p);
		});
		// console.log(lanes);

		// fill in gaps
		lanes = lanes.map(l => {
			let f = [];
			l = l.split("/").map(e => +e);
			l.map((e,k,r) => {
				let pair = [e, r[k+1]].join("/");
				if (exclude.includes(pair)) return;
				exclude.push(pair);

				for (let i=e, il=r[k+1]; i<il; i++) {
					f[i-1] = i == e ? e : "-";
				}
				if (k>=r.length-1) f.push(r[r.length-1]);
			});
			return f;
		}).map(r => r.filter(e => !!e));
		// console.log(lanes);
		// lanes.map(r => console.log(r.join("/")));

		// lanes before plot
		this.lanes = lanes;
	}

	addClass(node, name) {
		let names = (node.getAttribute("class") || "").split(" ");
		names = names.concat(name.split(" ")).sort((a,b) => a.localeCompare(b));
		names = [...new Set(names.filter(e => !!e))]; // clean up + remove duplicates
		node.setAttribute("class", names.join(" ").trim());
	}

	plot() {
		let xThread = this.xRoot.parentNode;
		// loop lanes
		this.lanes.map((lane, l) => {
			let b = lane[0] - 1;
			console.log(lane);
			lane.map((s, i, r) => {
				let num = s === "-" ? i+1+b : s,
					xPath = `.//tags/i[@id="messageId"][@value="${num}"]/../..`,
					xMail = xThread.selectSingleNode(xPath);
				// console.log(xMail);
				switch (true) {
					case (i === 0):
						this.addClass(xMail, `l${l+2}-up`);
						break;
					case (s === "-"):
						this.addClass(xMail, `l${l+2}-track`);
						break;
					case (i === r.length-1):
						this.addClass(xMail, `l${l+2}-down`);
						break;
					default:
						this.addClass(xMail, `l${l+2}-conn`);
				}
			});
		});
		// console.log(xThread);

		xThread.setAttribute("lanes", this.lanes.length + 1);
	}

	*juntion(node, path=Array(), visited=new Set()) {
		yield [...path, node];
		path.push(node);
		visited.add(node);
		for (let adjacent of this.getAdjacencies(node)) {
			if (!visited.has(adjacent)) {
				yield* this.juntion(adjacent, path, visited);
			}
		}
		path.pop();
	}

	*juntions(nodes) {
		for (let node of nodes) {
			yield* this.juntion(node);
		}
	}
}
