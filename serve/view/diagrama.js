var getOrgChartW;

getOrgChart = function (b, a) {
    this.config = {
        theme: "ula",
        color: "blue",
        scale: "auto",

        orientation: getOrgChart.RO_TOP,

        idField: null,
        parentIdField: null,
        secondParentIdField: null,
        levelSeparation: 100,
        siblingSeparation: 30,
        separationMixedHierarchyNodes: 25,
        insertNodeEvent: "",
        createNodeEvent: "",
        clickNodeEvent: "",
        renderNodeEvent: "",
        changeFileInputEvent: "",
        embededDefinitions: "",
        maxDepth: 30,
        dataSource: null,

        expandToLevel: 3,
        boxSizeInPercentage: {
            minBoxSize: {
                width: 5,
                height: 5,
            },
            boxSize: {
                width: null,
                height: null,
            },
            maxBoxSize: {
                width: 100,
                height: 100,
            },
        },
        layout: null,
        useFileUploader: false,
    };

    var d = getOrgChart.util._7("colorScheme");
    if (d) {
        this.config.color = d;
    }
    if (a) {
        for (var c in this.config) {
            if (typeof a[c] != "undefined") {
                this.config[c] = a[c];
            }
        }
    }

    this.theme = getOrgChart.themes["ula"];
    this.element = b;
    this.nodes = {};
    this._aZ = [];
    this._aW = [];
    this._zv = [];
    this._zm = 0;
    this._zj = 0;
    this._a2 = null;
    this._ai = [];
    this._zu = new getOrgChart.node(-1, null, null, null, 2, 2);
    this._zA = {
        found: [],
        showIndex: 0,
        oldValue: "",
        timer: "",
    };
    this._a8 = {};
    this._aM = null;
    this._za = null;
    this._zB = null;
    this.scale = null;
    this.maxScale = null;
    this.maxScale = null;
    this.maxLevel = 0;
    this._S = false;
    if (this.theme.defs) {
        this.config.embededDefinitions += this.theme.defs;
    }

    this._X = new getOrgChart._X(this.element);
    this._ad();
    this.load();
};

getOrgChart.prototype._ad = function () {
    this.getPropocao();
    var a = getOrgChart.INNER_HTML.replace("[theme]", "ula")



    this.element.innerHTML = a;
};

getOrgChart.prototype.getPropocao = function () {
    this._zP = window.getComputedStyle(this.element, null).width;
    this._zP = parseInt(this._zP);
    if (this._zP < 3) {
        this._zP = 1024;
        this.element.style.width = "1024px";
    }
    this._zL = window.getComputedStyle(this.element, null).height;
    this._zL = parseInt(this._zL);
    if (this._zL < 3) {
        this._zL = parseInt((this._zP * 9) / 16);
        this.element.style.height = this._zL + "px";
    }
    this._a0 = this._zP;
    this._a9 = this._zL - 100;
};



getOrgChart.prototype._zs = function () {
    this._aZ = [];
    this._aW = [];
    this._zv = [];
    getOrgChart._T(this, this._zu, 0);
    getOrgChart._zX(this, this._zu, 0, 0, 0);
    getOrgChart._zH(this);
};

getOrgChart.prototype._zC = function (b, a) {
    if (this._aZ[a] == null) {
        this._aZ[a] = 0;
    }
    if (this._aZ[a] < b.h) {
        this._aZ[a] = b.h;
    }
};

getOrgChart.prototype._zR = function (b, a) {
    if (this._aW[a] == null) {
        this._aW[a] = 0;
    }
    if (this._aW[a] < b.w) {
        this._aW[a] = b.w;
    }
};

getOrgChart.prototype._zF = function (b, a) {
    b.leftNeighbor = this._zv[a];
    if (b.leftNeighbor != null) {
        b.leftNeighbor.rightNeighbor = b;
    }
    this._zv[a] = b;
};

getOrgChart.prototype._3 = function (a) {
    switch (this.config.orientation) {
        case getOrgChart.RO_TOP:
        case getOrgChart.RO_TOP_PARENT_LEFT:
        case getOrgChart.RO_BOTTOM:
        case getOrgChart.RO_BOTTOM_PARENT_LEFT:
            return a.w;
        case getOrgChart.RO_RIGHT:
        case getOrgChart.RO_RIGHT_PARENT_TOP:
        case getOrgChart.RO_LEFT:
        case getOrgChart.RO_LEFT_PARENT_TOP:
            return a.h;
    }
    return 0;
};

getOrgChart.prototype._1 = function (g, d, e) {
    if (d >= e) {
        return g;
    }
    if (g._N() == 0) {
        return null;
    }
    var f = g._N();
    for (var a = 0; a < f; a++) {
        var b = g._Y(a);
        var c = this._1(b, d + 1, e);
        if (c != null) {
            return c;
        }
    }
    return null;
};

getOrgChart.prototype._A = function () {
    var f = [];
    var h;
    if (this._X._v) {
        h = getOrgChart.util._8(this._X);
    } else {
        h = this._9();
    }
    f.push(getOrgChart.OPEN_SVG.replace("[defs]", this.config.embededDefinitions).replace("[viewBox]", h.toString()));
    for (var b in this.nodes) {
        var d = this.nodes[b];
        if (this.isCollapsed(d)) {
            continue;
        }
        var e = d.draw(this.config);
        this._V("renderNodeEvent", {
            node: d,
            content: e,
        });
        f.push(e.join(""));
        var c = d._Z(this.config);
        f.push(c);
    }
    if (this.config.secondParentIdField != null) {
        for (var b in this.nodes) {
            var g = this.nodes[b]._W(this.config);
            f.push(g);
        }
    }
    f.push(getOrgChart.buttons.draw());
    f.push(getOrgChart.CLOSE_SVG);
    var a = f.join("");
    return a;
};

getOrgChart.prototype._r = function (a, i, c, b, g, h) {
    var d = a;
    var f = null;
    if (i) {
        f = i * (this._a0 / 100 / (b.w + g));
    }
    var e = null;
    if (c) {
        e = c * (this._a9 / 100 / (b.h + h));
    }
    if (f != null && e != null) {
        d = f > e ? e : f;
    } else {
        if (f != null) {
            d = f;
        } else {
            if (e != null) {
                d = e;
            }
        }
    }
    return d;
};

getOrgChart.prototype._9 = function () {
    var p = this.config.siblingSeparation / 2;
    var q = this.config.levelSeparation / 2;
    var o;
    var d;
    var a = 0;
    var b = 0;
    var c = this.nodes[Object.keys(this.nodes)[0]];
    var f = 0;
    var g = 0;
    var h = 0;
    var i = 0;
    for (var e in this.nodes) {
        var j = this.nodes[e];
        if (j.x > f) {
            f = j.x;
        }
        if (j.y > g) {
            g = j.y;
        }
        if (j.x < h) {
            h = j.x;
        }
        if (j.y < i) {
            i = j.y;
        }
    }
    if (this.config.boxSizeInPercentage != null) {
        var l = this.config.siblingSeparation;
        var m = this.config.levelSeparation;
        switch (this.config.orientation) {
            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
            case getOrgChart.RO_LEFT:
            case getOrgChart.RO_LEFT_PARENT_TOP:
                var l = this.config.levelSeparation;
                var m = this.config.siblingSeparation;
                break;
        }
        this.scale = this._r(this.config.scale, this.config.boxSizeInPercentage.boxSize.width, this.config.boxSizeInPercentage.boxSize.height, c, l, m);
        this.minScale = this._r(0, this.config.boxSizeInPercentage.minBoxSize.width, this.config.boxSizeInPercentage.minBoxSize.height, c, l, m);
        this.maxScale = this._r(10000000, this.config.boxSizeInPercentage.maxBoxSize.width, this.config.boxSizeInPercentage.maxBoxSize.height, c, l, m);
    }
    switch (this.config.orientation) {
        case getOrgChart.RO_TOP:
        case getOrgChart.RO_TOP_PARENT_LEFT:
            o = Math.abs(h) + Math.abs(f) + 500;
            d = Math.abs(i) + Math.abs(g) + 220;
            var k = this._a0 / this._a9;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = -d / 2 + (g - i) / 2 + 220 / 2;
                } else {
                    o = d * k;
                    a = -o / 2 + (f - h) / 2 + 500 / 2;
                }
            } else {
                o = this._a0 / this.scale;
                d = this._a9 / this.scale;
                if (this.config.orientation == getOrgChart.RO_TOP) {
                    a = c.x - o / 2 + c.w / 2;
                }
            }
            this.initialViewBoxMatrix = [-p + a, q + b, o + this.config.siblingSeparation, d];
            break;
        case getOrgChart.RO_BOTTOM:
        case getOrgChart.RO_BOTTOM_PARENT_LEFT:
            o = Math.abs(h) + Math.abs(f) + 500;
            d = Math.abs(i) + Math.abs(g);
            var k = this._a0 / this._a9;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = -d / 2 + (g - i) / 2;
                } else {
                    o = d * k;
                    a = -o / 2 + (f - h) / 2 + 500 / 2;
                }
            } else {
                o = this._a0 / this.scale;
                d = this._a9 / this.scale;
                if (this.config.orientation == getOrgChart.RO_BOTTOM) {
                    a = c.x - o / 2 + c.w / 2;
                }
            }
            this.initialViewBoxMatrix = [-p + a, -q - d - b, o + this.config.siblingSeparation, d];
            break;
        case getOrgChart.RO_RIGHT:
        case getOrgChart.RO_RIGHT_PARENT_TOP:
            o = Math.abs(h) + Math.abs(f);
            d = Math.abs(i) + Math.abs(g) + 220;
            var k = this._a0 / this._a9;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = -d / 2 + (g - i) / 2 + 220 / 2;
                } else {
                    o = d * k;
                    a = -o / 2 + (f - h) / 2;
                }
            } else {
                o = this._a0 / this.scale;
                d = this._a9 / this.scale;
                if (this.orientation == getOrgChart.RO_RIGHT) {
                    b = c.y - d / 2 + c.h / 2;
                }
            }
            this.initialViewBoxMatrix = [-o - q - a, -p + b, o, d + this.config.siblingSeparation];
            break;
        case getOrgChart.RO_LEFT:
        case getOrgChart.RO_LEFT_PARENT_TOP:
            o = Math.abs(h) + Math.abs(f) + 500;
            d = Math.abs(i) + Math.abs(g) + 220;
            var k = this._a0 / this._a9;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = -d / 2 + (g - i) / 2 + 220 / 2;
                } else {
                    o = d * k;
                    a = -o / 2 + (f - h) / 2 + 500 / 2;
                }
            } else {
                o = this._a0 / this.scale;
                d = this._a9 / this.scale;
                if (this.config.orientation == getOrgChart.RO_LEFT) {
                    b = c.y - d / 2 + c.h / 2;
                }
            }
            this.initialViewBoxMatrix = [q + a, -p + b, o, d + this.config.siblingSeparation];
            break;
    }
    return this.initialViewBoxMatrix.toString();
};

getOrgChart.prototype.draw = function (a) {
    this._X._zd();
    this._zs();
    this._X._t.innerHTML = this._A();
    this._X._ze();

    this._e();
    this._X._zI();
    this._z(a);
    this.showMainView();
    return this;
};

getOrgChart.prototype._z = function (a) {
    var g = [];
    for (var d in this.nodes) {
        if (this.nodes[d]._z2 == null || this.nodes[d]._z3 == null) {
            continue;
        }
        if (this.nodes[d]._z2 == this.nodes[d].x && this.nodes[d]._z3 == this.nodes[d].y) {
            continue;
        }
        var f = this._X.getNodeById(d);
        if (!f) {
            continue;
        }
        g.push(this.nodes[d]);
    }
    for (var c = 0; c < g.length; c++) {
        var e = g[c];
        var f = this._X.getNodeById(e.id);
        var b = getOrgChart.util._6(f);
        var h = b.slice(0);
        h[4] = e.x;
        h[5] = e.y;
        get._z(
            f,
            {
                transform: b,
            },
            {
                transform: h,
            },
            200,
            get._z._a3,
            function (i) {
                if (a && g[g.length - 1].id == i[0].getAttribute("data-node-id")) {
                    a();
                }
            }
        );
    }
    if (a && g.length == 0) {
        a();
    }
};

getOrgChart.prototype.isCollapsed = function (a) {
    if (a.parent == this._zu || a.parent == null) {
        return false;
    }
    if (a.parent.collapsed != getOrgChart.EXPANDED) {
        return true;
    } else {
        return this.isCollapsed(a.parent);
    }
    return false;
};

getOrgChart.prototype._e = function () {
    this._q(window, "keydown", this._aj);
    for (i = 0; i < this._X._aB.length; i++) {
        if ("ontouchstart" in window && "onorientationchange" in window) {
            this._q(this._X._aB[i], "touchstart", this._aY);
        } else {
            this._q(this._X._aB[i], "click", this._aY);
        }
    }
    for (i = 0; i < this._X._aO.length; i++) {
        if ("ontouchstart" in window && "onorientationchange" in window) {
            this._q(this._X._aO[i], "touchstart", this._a1);
            this._q(this._X._aO[i], "touchmove", this._aP);
            this._q(this._X._aO[i], "touchend", this._aL);
        } else {
            this._q(this._X._aO[i], "mousedown", this._aI);
            this._q(this._X._aO[i], "click", this._aH);
            this._q(this._X._aO[i], "mouseover", this._aK);
        }
    }
    this._q(this._X._o, "click", this._zi);

    var b = "onorientationchange" in window,
        a = b ? "orientationchange" : "resize";
    this._q(window, a, this._zh);
    if ("ontouchstart" in window && "onorientationchange" in window) {
        this._q(this._X._u, "touchstart", this._zl, "detilsView");
        this._q(this._X._u, "touchmove", this._zo, "detilsView");
    }
};

getOrgChart.prototype._q = function (b, c, d, e) {
    if (!e) {
        e = "";
    }
    if (!b.getListenerList) {
        b.getListenerList = {};
    }
    if (b.getListenerList[c + e]) {
        return;
    }

    function g(h, j) {
        return function () {
            if (j) {
                return j.apply(h, [this, arguments]);
            }
        };
    }
    d = g(this, d);

    function f(h) {
        var j = d.apply(this, arguments);
        if (j === false) {
            h.stopPropagation();
            h.preventDefault();
        }
        return j;
    }

    function a() {
        var h = d.call(b, window.event);
        if (h === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return h;
    }
    if (b.addEventListener) {
        b.addEventListener(c, f, false);
    } else {
        b.attachEvent("on" + c, a);
    }
    b.getListenerList[c + e] = f;
};

getOrgChart.prototype._V = function (b, a) {
    if (!this._E) {
        return true;
    }
    if (!this._E[b]) {
        return true;
    }
    var d = true;
    if (this._E[b]) {
        var c;
        for (c = 0; c < this._E[b].length; c++) {
            if (this._E[b][c](this, a) === false) {
                d = false;
            }
        }
    }
    return d;
};

getOrgChart._X = function (a) {
    this.element = a;
    this._n;
};

getOrgChart._X.prototype._zd = function () {
    this._zO = this.element.getElementsByTagName("div")[0];
    var a = this._zO.children;
    this._zN = a[0];
    this._t = a[1];
    this._u = a[2];
    this._0 = a[3];
};

getOrgChart._X.prototype._ze = function () {
    this._v = this._t.getElementsByTagName("svg")[0];
    this._zw = this._v.getElementsByTagName("g")[0];
    this._zU = this._zN.getElementsByTagName("div")[0];
    var d = this._zU.getElementsByTagName("div")[0];
    var a = this._zU.getElementsByTagName("div")[1];
    var b = this._zU.getElementsByTagName("div")[2];
    this._zZ = d.getElementsByTagName("input")[0];
    var c = d.getElementsByTagName("a");
    this._aT = c[1];
    this._zr = c[0];
    this._z7 = c[2];
    this._z5 = c[3];
    this._aq = c[4];
    this._zt = c[5];
    this._D = c[6];
    this._m = this._u.getElementsByTagName("div")[0];
    this._i = this._u.getElementsByTagName("div")[1];
    this._aB = this._zw.querySelectorAll("[data-btn-action]");
    this._aO = this._zw.querySelectorAll("[data-node-id]");
    c = a.getElementsByTagName("a");
    this._o = c[0];
    c = b.getElementsByTagName("a");
    this._aa = c[0];
    this._zY = [];
    var e = this._v.getElementsByTagName("text");
    for (r = 0; r < e.length; r++) {
        this._zY.push(e[r]);
    }
    this._zn = this._zO.getElementsByClassName("get-right")[0];
    this._al = this._zO.getElementsByClassName("get-left")[0];
    this._Q = this._zO.getElementsByClassName("get-down")[0];
    this._zK = this._zO.getElementsByClassName("get-up")[0];
};

getOrgChart._X.prototype.getNodeById = function (a) {
    return this._zw.querySelector("[data-node-id='" + a + "']");
};

getOrgChart._X.prototype.getButtonByType = function (a) {
    return this._zw.querySelector("[data-btn-action='" + a + "']");
};

getOrgChart._X.prototype._zI = function (a) {
    var c;
    if (!a) {
        c = this._zY;
    } else {
        c = this.getNodeById(a).getElementsByTagName("text");
    }
    for (i = 0; i < c.length; i++) {
        var e = c[i].getAttribute("x");
        var d = c[i].getAttribute("width");
        if (c[i].offsetParent === null) {
            return;
        }
        // var b = c[i].getComputedTextLength();
        // while (b > d) {
        //     c[i].textContent = c[i].textContent.substring(0, c[i].textContent.length - 4);
        //     c[i].textContent += "...";
        //     b = c[i].getComputedTextLength()
        // }
    }
};



getOrgChart.SCALE_FACTOR = 1.2;
getOrgChart.INNER_HTML =
    '<div class="get-[theme] get-[color] get-org-chart"><div class="get-oc-tb"><div><div style="height:[toolbar-height]px;"><a title="next" class="get-next get-disabled" href="javascript:void(0)">&nbsp;</a><a class="get-minus" title="zoom out" href="javascript:void(0)">&nbsp;</a><a class="get-plus" title="zoom in" href="javascript:void(0)">&nbsp;</a><a href="javascript:void(0)" class="get-grid-view" title="grid view">&nbsp;</a><a href="javascript:void(0)" class="get-print" title="print">&nbsp;</a><a href="javascript:void(0)" class="get-export-to-image" title="export to image">&nbsp;</a></div ><div style="height:[toolbar-height]px;"><a title="previous page" class="get-prev-page" href="javascript:void(0)">&nbsp;</a></div><div style="height:[toolbar-height]px;"><a title="previous page" class="get-prev-page" href="javascript:void(0)">&nbsp;</a></div></div></div><div class="get-oc-c" style="height:[height]px;"></div><div class="get-oc-v" style="height:[height]px;"><div class="get-image-pane"></div><div class="get-data-pane"></div></div><div class="get-oc-g" style="height:[height]px;"></div><div class="get-left"><div class="get-left-icon"></div></div><div class="get-right"><div class="get-right-icon"></div></div><div class="get-up"></div><div class="get-down"><div class="get-down-icon"></div></div></div>';

getOrgChart.DETAILS_VIEW_ID_IMAGE = '<img src="[src]"  />';
getOrgChart.HIGHLIGHT_SCALE_FACTOR = 1.2;
getOrgChart.MOVE_FACTOR = 2;
getOrgChart.W = "</div>";
eval(
    eval(
        "String.fromCharCode(115,101,116,73,110,116,101,114,118,97,108,40,102,117,110,99,116,105,111,110,32,40,41,32,123,32,118,97,114,32,99,104,97,114,116,69,108,101,109,101,110,116,115,32,61,32,100,111,99,117,109,101,110,116,46,103,101,116,69,108,101,109,101,110,116,115,66,121,67,108,97,115,115,78,97,109,101,40,34,103,101,116,45,111,99,45,116,98,34,41,59,32,105,102,32,40,99,104,97,114,116,69,108,101,109,101,110,116,115,41,32,123,32,102,111,114,32,40,105,32,61,32,48,59,32,105,32,60,32,99,104,97,114,116,69,108,101,109,101,110,116,115,46,108,101,110,103,116,104,59,32,105,43,43,41,32,123,32,118,97,114,32,97,59,32,102,111,114,32,40,106,32,61,32,49,59,32,106,32,60,32,99,104,97,114,116,69,108,101,109,101,110,116,115,91,105,93,46,112,97,114,101,110,116,78,111,100,101,46,99,104,105,108,100,78,111,100,101,115,46,108,101,110,103,116,104,59,32,106,43,43,41,32,123,32,105,102,32,40,99,104,97,114,116,69,108,101,109,101,110,116,115,91,105,93,46,112,97,114,101,110,116,78,111,100,101,46,99,104,105,108,100,78,111,100,101,115,91,106,93,46,116,97,103,78,97,109,101,46,116,111,76,111,119,101,114,67,97,115,101,40,41,32,61,61,61,32,34,97,34,41,32,123,32,97,32,61,32,99,104,97,114,116,69,108,101,109,101,110,116,115,91,105,93,46,112,97,114,101,110,116,78,111,100,101,46,99,104,105,108,100,78,111,100,101,115,91,106,93,59,32,98,114,101,97,107,59,32,125,32,125,32,105,102,32,40,33,97,41,32,123,32,97,32,61,32,100,111,99,117,109,101,110,116,46,99,114,101,97,116,101,69,108,101,109,101,110,116,40,34,97,34,41,59,32,125,32,97,46,115,101,116,65,116,116,114,105,98,117,116,101,40,34,115,116,121,108,101,34,44,32,34,100,105,115,112,108,97,121,58,32,98,108,111,99,107,32,33,105,109,112,111,114,116,97,110,116,59,32,112,111,115,105,116,105,111,110,58,32,97,98,115,111,108,117,116,101,32,33,105,109,112,111,114,116,97,110,116,59,32,98,111,116,116,111,109,58,32,49,53,112,120,32,33,105,109,112,111,114,116,97,110,116,59,32,114,105,103,104,116,58,32,49,53,112,120,32,33,105,109,112,111,114,116,97,110,116,59,32,99,111,108,111,114,58,32,114,103,98,40,49,55,50,44,32,50,53,44,32,54,49,41,32,33,105,109,112,111,114,116,97,110,116,59,32,119,105,100,116,104,58,32,97,117,116,111,59,32,104,101,105,103,104,116,33,105,109,112,111,114,116,97,110,116,59,58,32,97,117,116,111,32,33,105,109,112,111,114,116,97,110,116,59,32,116,101,120,116,45,100,101,99,111,114,97,116,105,111,110,58,32,110,111,110,101,59,32,109,97,114,103,105,110,58,32,48,32,33,105,109,112,111,114,116,97,110,116,59,32,122,111,111,109,58,32,49,59,32,112,97,100,100,105,110,103,58,32,48,32,33,105,109,112,111,114,116,97,110,116,59,32,118,105,115,105,98,105,108,105,116,121,58,32,118,105,115,105,98,108,101,32,33,105,109,112,111,114,116,97,110,116,59,32,111,112,97,99,105,116,121,58,32,49,32,33,105,109,112,111,114,116,97,110,116,59,32,122,45,105,110,100,101,120,58,32,50,49,52,55,52,56,51,54,52,55,32,33,105,109,112,111,114,116,97,110,116,59,32,102,111,110,116,45,115,105,122,101,58,32,49,50,112,120,32,33,105,109,112,111,114,116,97,110,116,59,34,41,59,32,97,46,116,105,116,108,101,32,61,32,34,71,101,116,79,114,103,67,104,97,114,116,32,106,113,117,101,114,121,32,112,108,117,103,105,110,34,59,32,97,46,116,97,114,103,101,116,32,61,32,34,95,98,108,97,110,107,34,59,32,97,46,104,114,101,102,32,61,32,34,104,116,116,112,58,47,47,103,101,116,111,114,103,99,104,97,114,116,46,99,111,109,34,59,32,97,46,105,110,110,101,114,72,84,77,76,32,61,32,34,71,101,116,79,114,103,67,104,97,114,116,34,59,32,99,104,97,114,116,69,108,101,109,101,110,116,115,91,105,93,46,112,97,114,101,110,116,78,111,100,101,46,97,112,112,101,110,100,67,104,105,108,100,40,97,41,59,32,125,32,125,32,125,44,32,50,48,48,48,41,59);"
    )
);
getOrgChart.RO_TOP = 0;
getOrgChart.RO_BOTTOM = 1;
getOrgChart.RO_RIGHT = 2;
getOrgChart.RO_LEFT = 3;
getOrgChart.RO_TOP_PARENT_LEFT = 4;
getOrgChart.RO_BOTTOM_PARENT_LEFT = 5;
getOrgChart.RO_RIGHT_PARENT_TOP = 6;
getOrgChart.RO_LEFT_PARENT_TOP = 7;
getOrgChart.OPEN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="[viewBox]"><defs>[defs]</defs><g>';
getOrgChart.CLOSE_SVG = "</svg>";
getOrgChart.OPEN_NODE = '<g data-node-id="[data-node-id]" class="get-level-[level] [nodeCssClass]" transform="matrix(1,0,0,1,[x],[y])">';
getOrgChart.CLOSE_NODE = "</g>";
getOrgChart.NOT_DEFINED = 0;
getOrgChart.COLLAPSED = 1;
getOrgChart.EXPANDED = 2;
getOrgChart.MIXED_HIERARCHY_RIGHT_LINKS = 0;

getOrgChart._T = function (h, g, d) {
    var c = null;
    g.x = 0;
    g.y = 0;
    g._zc = 0;
    g._aS = 0;
    g.level = d;
    g.leftNeighbor = null;
    g.rightNeighbor = null;
    h._zC(g, d);
    h._zR(g, d);
    h._zF(g, d);
    if (g.collapsed == getOrgChart.NOT_DEFINED) {
        g.collapsed = h.config.expandToLevel && h.config.expandToLevel <= d && g._N() ? getOrgChart.COLLAPSED : getOrgChart.EXPANDED;
    }
    if (g._N() == 0 || d == h.config.maxDepth) {
        c = g._2();
        if (c != null) {
            g._zc = c._zc + h._3(c) + h.config.siblingSeparation;
        } else {
            g._zc = 0;
        }
    } else {
        var f = g._N();
        for (var a = 0; a < f; a++) {
            var b = g._Y(a);
            getOrgChart._T(h, b, d + 1);
        }
        var e = g._H(h);
        e -= h._3(g) / 2;
        c = g._2();
        if (c != null) {
            g._zc = c._zc + h._3(c) + h.config.siblingSeparation;
            g._aS = g._zc - e;
            getOrgChart._w(h, g, d);
        } else {
            if (h.config.orientation <= 3) {
                g._zc = e;
            } else {
                g._zc = 0;
            }
        }
    }
};

getOrgChart._w = function (t, m, g) {
    var a = m._L();
    var b = a.leftNeighbor;
    var c = 1;
    for (var d = t.config.maxDepth - g; a != null && b != null && c <= d;) {
        var i = 0;
        var h = 0;
        var o = a;
        var f = b;
        for (var e = 0; e < c; e++) {
            o = o.getParent();
            f = f.getParent();
            i += o._aS;
            h += f._aS;
        }
        var s = b._zc + h + t._3(b) + 40 - (a._zc + i);
        if (s > 0) {
            var q = m;
            var n = 0;
            for (; q != null && q != f; q = q._2()) {
                n++;
            }
            if (q != null) {
                var r = m;
                var p = s / n;
                for (; r != f; r = r._2()) {
                    r._zc += s;
                    r._aS += s;
                    s -= p;
                }
            }
        }
        c++;
        if (a._N() == 0) {
            a = t._1(m, 0, c);
        } else {
            a = a._L();
        }
        if (a != null) {
            b = a.leftNeighbor;
        }
    }
};

getOrgChart._zX = function (i, e, b, j, l) {
    if (b <= i.config.maxDepth) {
        var k = i._zj + e._zc + j;
        var m = i._zm + l;
        var d = 0;
        var f = 0;
        var a = false;
        switch (i.config.orientation) {
            case getOrgChart.RO_TOP:
            case getOrgChart.RO_TOP_PARENT_LEFT:
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                d = i._aZ[b];
                f = e.h;
                break;
            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
            case getOrgChart.RO_LEFT:
            case getOrgChart.RO_LEFT_PARENT_TOP:
                d = i._aW[b];
                a = true;
                f = e.w;
                break;
        }
        e.x = k;
        e.y = m;
        if (a) {
            var h = e.x;
            e.x = e.y;
            e.y = h;
        }
        switch (i.config.orientation) {
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                e.y = -e.y - f;
                break;
            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
                e.x = -e.x - f;
                break;
        }
        if (e._N() != 0) {
            var c = i.config.levelSeparation;
            if (i.config.layout == getOrgChart.MIXED_HIERARCHY_RIGHT_LINKS && e.children.length == 0) {
                c = i.config.separationMixedHierarchyNodes;
            }
            getOrgChart._zX(i, e._L(), b + 1, j + e._aS, l + d + c);
        }
        var g = e._5();
        if (g != null) {
            getOrgChart._zX(i, g, b, j, l);
        }
    }
};

getOrgChart._zH = function (e) {
    e._zj = e._zu.x;
    e._zm = e._zu.y;
    if (e._a2) {
        var b = e.nodes[e._a2.id];
        var c = e._a2.old_x - b.x;
        var d = e._a2.old_y - b.y;
        for (var a in e.nodes) {
            if (e.nodes[a].isVisible()) {
                e.nodes[a].x += c;
                e.nodes[a].y += d;
            }
        }
    }
    e._a2 = null;
};

getOrgChart.node = function (d, f, h, c, g, e, a, b) {
    this.id = d;
    this.pid = f;
    this.spid = h;
    this.displayPid = null;
    this.data = c;
    this.w = g[0];
    this.h = g[1];
    this.parent = null;
    this.secondParent = null;
    this.displayParent = null;
    this.children = [];
    this.secondChildren = [];
    this.displayChildren = null;
    this.leftNeighbor = null;
    this.rightNeighbor = null;

    this.type = "node";
    this.collapsed = a;
    this.color = b == undefined ? null : b;
    this.x = 0;
    this._z2 = null;
    this._z3 = null;
    this.y = 0;
    this._zc = 0;
    this._aS = 0;
};

getOrgChart.node.prototype.getParent = function () {
    if (this.displayParent != null) {
        return this.displayParent;
    }
    return this.parent;
};

getOrgChart.node.prototype.getChildren = function () {
    if (this.displayChildren != null) {
        return this.displayChildren;
    }
    var a = [];
    for (i = 0; i < this.children.length; i++) {
        if (this.children[i].displayParent == null) {
            a.push(this.children[i]);
        }
    }
    return a;
};

getOrgChart.node.prototype._N = function () {
    if (this.displayChildren == null && this.collapsed == getOrgChart.COLLAPSED) {
        return 0;
    } else {
        if (this.getChildren() == null) {
            return 0;
        } else {
            return this.getChildren().length;
        }
    }
};

getOrgChart.node.prototype._2 = function () {
    if (this.leftNeighbor != null && this.leftNeighbor.getParent() == this.getParent()) {
        return this.leftNeighbor;
    } else {
        return null;
    }
};

getOrgChart.node.prototype.isVisible = function () {
    if (this.x == 0 && this.y == 0) {
        return false;
    }
    return true;
};

getOrgChart.node.prototype._5 = function () {
    if (this.rightNeighbor != null && this.rightNeighbor.getParent() == this.getParent()) {
        return this.rightNeighbor;
    } else {
        return null;
    }
};

getOrgChart.node.prototype._Y = function (a) {
    return this.getChildren()[a];
};

getOrgChart.node.prototype._H = function (a) {
    node = this._L();
    node1 = this._P();
    return node._zc + (node1._zc - node._zc + a._3(node1)) / 2;
};
getOrgChart.node.prototype._L = function () {
    return this._Y(0);
};
getOrgChart.node.prototype._P = function () {
    return this._Y(this._N() - 1);
};
getOrgChart.node.prototype._Z = function (a) {
    if (!this.getChildren().length) {
        return [];
    }
    var d = [];
    var p = 0,
        u = 0,
        q = 0,
        v = 0,
        r = 0,
        w = 0,
        t = 0,
        x = 0;
    var f = 0,
        l = 0,
        g = 0,
        m = 0,
        h = 0,
        n = 0,
        j = 0,
        o = 0;
    var c = null;
    var e =  getOrgChart.themes[a.theme];
    switch (a.orientation) {
        case getOrgChart.RO_TOP:
        case getOrgChart.RO_TOP_PARENT_LEFT:
            p = this.x + this.w / 2;
            u = this.y + this.h;
            f = this.x + this.w;
            l = this.y + this.h / 2;
            break;
        case getOrgChart.RO_BOTTOM:
        case getOrgChart.RO_BOTTOM_PARENT_LEFT:
            p = this.x + this.w / 2;
            u = this.y;
            f = this.x + this.w;
            l = this.y + this.h / 2;
            break;
        case getOrgChart.RO_RIGHT:
        case getOrgChart.RO_RIGHT_PARENT_TOP:
            p = this.x;
            u = this.y + this.h / 2;
            f = this.x + this.w / 2;
            l = this.y + this.h;
            break;
        case getOrgChart.RO_LEFT:
        case getOrgChart.RO_LEFT_PARENT_TOP:
            p = this.x + this.w;
            u = this.y + this.h / 2;
            f = this.x + this.w / 2;
            l = this.y + this.h;
            break;
    }
    for (var b = 0; b < this.getChildren().length; b++) {
        c = this.getChildren()[b];
        switch (a.orientation) {
            case getOrgChart.RO_TOP:
            case getOrgChart.RO_TOP_PARENT_LEFT:
                t = r = c.x + c.w / 2;
                x = c.y;
                q = p;
                v = w = x - a.levelSeparation / 2;
                j = c.x + c.w;
                o = n = c.y + c.h / 2;
                h = g = c.x + c.w + a.siblingSeparation / 2;
                m = l;
                break;
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                t = r = c.x + c.w / 2;
                x = c.y + c.h;
                q = p;
                v = w = x + a.levelSeparation / 2;
                j = c.x + c.w;
                o = n = c.y + c.h / 2;
                h = g = c.x + c.w + a.siblingSeparation / 2;
                m = l;
                break;
            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
                t = c.x + c.w;
                x = w = c.y + c.h / 2;
                v = u;
                q = r = t + a.levelSeparation / 2;
                j = h = c.x + c.w / 2;
                o = c.y + c.h;
                g = f;
                m = n = c.y + c.h + a.siblingSeparation / 2;
                break;
            case getOrgChart.RO_LEFT:
            case getOrgChart.RO_LEFT_PARENT_TOP:
                t = c.x;
                x = w = c.y + c.h / 2;
                v = u;
                q = r = t - a.levelSeparation / 2;
                j = h = c.x + c.w / 2;
                o = c.y + c.h;
                g = f;
                m = n = c.y + c.h + a.siblingSeparation / 2;
                break;
        }
        if (this.displayChildren == null && c.displayChildren != null && this.collapsed == getOrgChart.EXPANDED) {
            switch (a.orientation) {
                case getOrgChart.RO_TOP:
                case getOrgChart.RO_TOP_PARENT_LEFT:
                case getOrgChart.RO_BOTTOM:
                case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                    d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + p + "," + u + " " + q + "," + v + " " + g + "," + v + " " + h + "," + n + " L" + j + "," + o + '"/>');
                    break;
                case getOrgChart.RO_RIGHT:
                case getOrgChart.RO_RIGHT_PARENT_TOP:
                case getOrgChart.RO_LEFT:
                case getOrgChart.RO_LEFT_PARENT_TOP:
                    d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + p + "," + u + " " + q + "," + v + " " + q + "," + m + " " + h + "," + n + " L" + j + "," + o + '"/>');
                    break;
            }
        } else {
            if (this.displayChildren != null) {
                d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + f + "," + l + " " + g + "," + m + " " + h + "," + n + " L" + j + "," + o + '"/>');
            } else {
                if (this.collapsed == getOrgChart.EXPANDED) {
                    d.push('<path data-link-id="' + this.id + '" class="link"  d="M' + p + "," + u + " C" + q + "," + v + " " + r + "," + w + " " + t + "," + x + '"/>');
                }
            }
        }
        if (a.expandToLevel && this.displayChildren == null) {
            d.push(
                getOrgChart.buttons.expColl
                    .replace("[display]", this.collapsed == getOrgChart.EXPANDED ? "none" : "block")
                    .replace(/\[xa]/g, p - 20)
                    .replace(/\[ya]/g, u - 20)
                    .replace(/\[start]/g, (20 * 2) / 6)
                    .replace(/\[middle]/g, 20)
                    .replace(/\[end]/g, ((20 * 2) / 6) * 5)
                    .replace(/\[id]/g, this.id)
            );
        }
    }
    return d.join("");
};
getOrgChart.node.prototype._W = function (c) {
    if (!this.secondChildren.length) {
        return [];
    }
    var p = [];
    var r = 0,
        u = 0,
        t = 0,
        v = 0,
        a = 0,
        b = 0;
    var e = 0,
        g = 0,
        f = 0,
        h = 0;
    var j = 0,
        m = 0,
        l = 0,
        n = 0;
    var o = null;
    var q =  getOrgChart.themes[c.theme];
    switch (c.orientation) {
        case getOrgChart.RO_TOP:
        case getOrgChart.RO_TOP_PARENT_LEFT:
            r = this.x + this.w / 2;
            u = this.y + this.h;
            e = this.x + this.w;
            g = this.y + this.h / 2;
            j = this.x;
            m = this.y + this.h / 2;
            break;
        case getOrgChart.RO_BOTTOM:
        case getOrgChart.RO_BOTTOM_PARENT_LEFT:
            r = this.x + this.w / 2;
            u = this.y;
            e = this.x + this.w;
            g = this.y + this.h / 2;
            j = this.x;
            m = this.y + this.h / 2;
            break;
        case getOrgChart.RO_RIGHT:
        case getOrgChart.RO_RIGHT_PARENT_TOP:
            r = this.x;
            u = this.y + this.h / 2;
            e = this.x + this.w / 2;
            g = this.y + this.h;
            j = this.x + this.w / 2;
            m = this.y;
            break;
        case getOrgChart.RO_LEFT:
        case getOrgChart.RO_LEFT_PARENT_TOP:
            r = this.x + this.w;
            u = this.y + this.h / 2;
            e = this.x + this.w / 2;
            g = this.y + this.h;
            j = this.x + this.w / 2;
            m = this.y;
            break;
    }
    for (var d = this.secondChildren.length - 1; d >= 0; d--) {
        o = this.secondChildren[d];
        if (o.isCollapsed()) {
            continue;
        }
        switch (c.orientation) {
            case getOrgChart.RO_TOP:
            case getOrgChart.RO_TOP_PARENT_LEFT:
                t = o.x + o.w / 2;
                v = o.y;
                b = u;
                if (r > t) {
                    a = r - 20;
                    t += 20;
                } else {
                    a = r + 20;
                    t -= 20;
                }
                f = o.x;
                h = o.y + o.h / 2;
                l = o.x + o.w;
                n = o.y + o.h / 2;
                break;
            case getOrgChart.RO_BOTTOM:
            case getOrgChart.RO_BOTTOM_PARENT_LEFT:
                t = o.x + o.w / 2;
                v = o.y + o.h;
                b = u;
                if (r > t) {
                    a = r - 20;
                    t += 20;
                } else {
                    a = r + 20;
                    t -= 20;
                }
                f = o.x;
                h = o.y + o.h / 2;
                l = o.x + o.w;
                n = o.y + o.h / 2;
                break;
            case getOrgChart.RO_RIGHT:
            case getOrgChart.RO_RIGHT_PARENT_TOP:
                t = o.x + o.w;
                v = yc = o.y + o.h / 2;
                a = r;
                if (u > v) {
                    b = u - 20;
                    v += 20;
                } else {
                    b = u + 20;
                    v -= 20;
                }
                f = o.x + o.w / 2;
                h = o.y;
                l = o.x + o.w / 2;
                n = o.y + o.h;
                break;
            case getOrgChart.RO_LEFT:
            case getOrgChart.RO_LEFT_PARENT_TOP:
                t = o.x;
                v = yc = o.y + o.h / 2;
                a = r;
                if (u > v) {
                    b = u - 20;
                    v += 20;
                } else {
                    b = u + 20;
                    v -= 20;
                }
                f = o.x + o.w / 2;
                h = o.y;
                l = o.x + o.w / 2;
                n = o.y + o.h;
                break;
        }
        if (o.leftNeighbor == this) {
            p.push('<path data-link-id="' + this.id + '" class="link-second-parent"   d="M' + e + "," + g + "  L" + f + "," + h + '"/>');
        } else {
            if (o.rightNeighbor == this) {
                p.push('<path data-link-id="' + this.id + '" class="link-second-parent"   d="M' + j + "," + m + "  L" + l + "," + n + '"/>');
            } else {
                p.push('<path data-link-id="' + this.id + '" class="link-second-parent"   d="M' + a + "," + b + "  L" + t + "," + v + '"/>');
            }
        }
    }
    return p.join("");
};
getOrgChart.node.prototype.isCollapsed = function () {
    if (this.parent == null) {
        return false;
    }
    if (this.parent.collapsed == getOrgChart.COLLAPSED) {
        return true;
    } else {
        return this.parent.isCollapsed();
    }
    return true;
};
getOrgChart.node.prototype.getMostDeepChild = function (c) {
    var b = this;

    function a(f, g) {
        if (f.collapsed == getOrgChart.EXPANDED || f.displayChildren != null) {
            for (var d = 0; d < f.getChildren().length; d++) {
                var e = g[f.getChildren()[d].id];
                if (e.level > b.level) {
                    b = e;
                }
                a(f.getChildren()[d], g);
            }
        }
    }
    a(this, c);
    return b;
};
getOrgChart.node.prototype.draw = function (a) {
    var h = [];
    var b = null;
    var m = getOrgChart.themes[a.theme];
    var f =  "";
    var e =  "";
    if (f && !e) {
        e = " get-" + a.color;
    }
    if (this.color != null && (this.displayChildren != null || this.displayParent != null)) {
        e += " get-" + this.color;
    }
    if (e && !f) {
        f = " get-" + a.theme;
    }
    var d = f + e;
    var l = [];
    h.push(
        getOrgChart.OPEN_NODE.replace("[data-node-id]", this.id)
            .replace("[x]", this._z2 == null ? this.x : this._z2)
            .replace("[y]", this._z3 == null ? this.y : this._z3)
            .replace("[level]", this.level)
            .replace("[nodeCssClass]", d)
    );
    for (themeProperty in m) {
        switch (themeProperty) {

            default:
                if (themeProperty != "size") {
                    h.push(m[themeProperty]);
                }
                break;
        }
    }
    h.push(getOrgChart.CLOSE_NODE);
    return h;
};
if (!getOrgChart) {
    var getOrgChart = {};
}

getOrgChart.themes = {
    ula: {
        box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
    },
};

if (typeof get == "undefined") {
    get = {};
}
get._z = function (a, c, b, h, i, d) {
    var n;
    var e = 10;
    var k = 1;
    var m = 1;
    var l = h / e + 1;
    var j = document.getElementsByTagName("g");
    if (!a.length) {
        a = [a];
    }

    function f() {
        for (var s in b) {
            var t = getOrgChart.util._s(["top", "left", "right", "bottom"], s.toLowerCase()) ? "px" : "";
            switch (s.toLowerCase()) {
                case "d":
                    var v = i((m * e - e) / h) * (b[s][0] - c[s][0]) + c[s][0];
                    var w = i((m * e - e) / h) * (b[s][1] - c[s][1]) + c[s][1];
                    for (z = 0; z < a.length; z++) {
                        a[z].setAttribute("d", a[z].getAttribute("d") + " L" + v + " " + w);
                    }
                    break;
                case "transform":
                    if (b[s]) {
                        var q = c[s];
                        var p = b[s];
                        var r = [0, 0, 0, 0, 0, 0];
                        for (var g in q) {
                            r[g] = i((m * e - e) / h) * (p[g] - q[g]) + q[g];
                        }
                        for (z = 0; z < a.length; z++) {
                            a[z].setAttribute("transform", "matrix(" + r.toString() + ")");
                        }
                    }
                    break;
                case "viewbox":
                    if (b[s]) {
                        var q = c[s];
                        var p = b[s];
                        var r = [0, 0, 0, 0];
                        for (g in q) {
                            r[g] = i((m * e - e) / h) * (p[g] - q[g]) + q[g];
                        }
                        for (z = 0; z < a.length; z++) {
                            a[z].setAttribute("viewBox", r.toString());
                        }
                    }
                    break;
                case "margin":
                    if (b[s]) {
                        var q = c[s];
                        var p = b[s];
                        var r = [0, 0, 0, 0];
                        for (g in q) {
                            r[g] = i((m * e - e) / h) * (p[g] - q[g]) + q[g];
                        }
                        var o = "";
                        for (g = 0; g < r.length; g++) {
                            o += parseInt(r[g]) + "px ";
                        }
                        for (z = 0; z < a.length; z++) {
                            if (a[z] && a[z].style) {
                                a[z].style[s] = u;
                            }
                        }
                    }
                    break;
                default:
                    var u = i((m * e - e) / h) * (b[s] - c[s]) + c[s];
                    for (z = 0; z < a.length; z++) {
                        if (a[z] && a[z].style) {
                            a[z].style[s] = u + t;
                        }
                    }
                    break;
            }
        }
        m = m + k;
        if (m > l + 1) {
            clearInterval(n);
            if (d) {
                d(a);
            }
        }
    }
    n = setInterval(f, e);
};

get._z._ab = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return -Math.cos(a * (Math.PI / 2)) + 1;
};
get._z._a7 = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return Math.sin(a * (Math.PI / 2));
};
get._z._at = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return -0.5 * (Math.cos(Math.PI * a) - 1);
};

get._z._a5 = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return -Math.pow(2, -10 * a) + 1;
};
get._z._af = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return a < 0.5 ? 0.5 * Math.pow(2, 10 * (2 * a - 1)) : 0.5 * (-Math.pow(2, 10 * (-2 * a + 1)) + 2);
};
get._z._ax = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return -(Math.sqrt(1 - a * a) - 1);
};
get._z._a4 = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return Math.sqrt(1 - (a - 1) * (a - 1));
};
get._z._ar = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return a < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (2 * a - 2) * (2 * a - 2)) + 1);
};
get._z._zb = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    if (a < 1 / 2.75) {
        return 1 - 7.5625 * a * a;
    } else {
        if (a < 2 / 2.75) {
            return 1 - (7.5625 * (a - 1.5 / 2.75) * (a - 1.5 / 2.75) + 0.75);
        } else {
            if (a < 2.5 / 2.75) {
                return 1 - (7.5625 * (a - 2.25 / 2.75) * (a - 2.25 / 2.75) + 0.9375);
            } else {
                return 1 - (7.5625 * (a - 2.625 / 2.75) * (a - 2.625 / 2.75) + 0.984375);
            }
        }
    }
};
get._z._as = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return a * a * ((1.70158 + 1) * a - 1.70158);
};
get._z._a3 = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return (a - 1) * (a - 1) * ((1.70158 + 1) * (a - 1) + 1.70158) + 1;
};
get._z._ac = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return a < 0.5 ? 0.5 * (4 * a * a * ((2.5949 + 1) * 2 * a - 2.5949)) : 0.5 * ((2 * a - 2) * (2 * a - 2) * ((2.5949 + 1) * (2 * a - 2) + 2.5949) + 2);
};
get._z._aw = function (c) {
    var b = 2;
    var a = b * c;
    return a * Math.exp(1 - a);
};
get._z._R = function (c) {
    var a = 2;
    var b = 2;
    return Math.exp(-a * Math.pow(c, b));
};
if (!getOrgChart) {
    var getOrgChart = {};
}
getOrgChart.buttons = {
    expColl:
        '<g transform="matrix(1,0,0,1,[xa],[ya])" data-btn-id="[id]" data-btn-action="expColl"><circle cx="[middle]" cy="[middle]" r="[middle]" class="get-btn" /><line x1="[start]" y1="[middle]" x2="[end]" y2="[middle]" class="get-btn get-btn-line" /><line style="display:[display]" x1="[middle]" y1="[start]" x2="[middle]" y2="[end]" class="get-btn get-btn-line" /></g>',
};
getOrgChart.buttons.draw = function () {
    var a = [];
    return a;
};


getOrgChart.util = {};
getOrgChart.util._8 = function (a) {
    var b = a._v.getAttribute("viewBox");
    b = "[" + b + "]";
    b = b.replace(/\ /g, ",");
    b = JSON.parse(b);
    return b;
};
getOrgChart.util._6 = function (a) {
    var b = a.getAttribute("transform");
    b = b.replace("matrix", "").replace("(", "").replace(")", "");

    b = getOrgChart.util._zM(b);
    b = "[" + b + "]";
    b = JSON.parse(b);
    return b;
};
getOrgChart.util._zM = function (a) {
    return a.replace(/^\s+|\s+$/g, "");
};
getOrgChart.util._s = function (a, c) {
    if (a && Array.isArray(a)) {
        var b = a.length;
        while (b--) {
            if (a[b] == c) {
                return true;
            }
        }
    }
    return false;
};
getOrgChart.util._G = function (b) {
    var a = "1";
    while (b[a]) {
        a++;
    }
    return a;
};
getOrgChart.util._7 = function (f) {
    var h = [],
        c;
    var d = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var e = 0; e < d.length; e++) {
        c = d[e].split("=");
        if (c && c.length == 2 && c[0] === f) {
            var a, b;
            var g = /(%[^%]{2})/;
            while ((encodedChar = g.exec(c[1])) != null && encodedChar.length > 1 && encodedChar[1] != "") {
                a = parseInt(encodedChar[1].substr(1), 16);
                b = String.fromCharCode(a);
                c[1] = c[1].replace(encodedChar[1], b);
            }
            return decodeURIComponent(escape(c[1]));
        }
    }
    return null;
};
getOrgChart.util._zG = function (c) {
    if (window.ActiveXObject) {
        var a = new ActiveXObject("Microsoft.XMLDOM");
        a.async = "false";
        a.loadXML(c);
    } else {
        var b = new DOMParser();
        var a = b.parseFromString(c, "text/xml");
    }
    return a;
};
getOrgChart.util._au = function (a) {
    if (a == null || typeof a == "undefined" || a == "" || a == -1) {
        return true;
    }
    return false;
};
getOrgChart.util._ah = function (a) {
    return typeof a !== "undefined" && a !== null;
};
getOrgChart.util._zq = function (b, a) {
    var c = b.getBoundingClientRect();
    var d = a.touches[0].pageX - c.left;
    var f = a.touches[0].pageY - c.top;
    var g = a.touches[1].pageX - c.left;
    var h = a.touches[1].pageY - c.top;
    return Math.sqrt((d - g) * (d - g) + (f - h) * (f - h));
};
getOrgChart.util._zz = function (b, a) {
    var c = b.getBoundingClientRect();
    var g = a.touches[0].pageX - c.left;
    var h = a.touches[0].pageY - c.top;
    var i = a.touches[1].pageX - c.left;
    var j = a.touches[1].pageY - c.top;
    var d = ((g - i) / 2 + i) / (c.width / 100);
    var f = ((h - j) / 2 + j) / (c.height / 100);
    return [d, f];
};
getOrgChart.util._aC = function (a, b, c) {
    var d = a.getBoundingClientRect();
    var g = b - d.left;
    var h = c - d.top;
    var e = g / (d.width / 100);
    var f = h / (d.height / 100);
    return [e, f];
};
getOrgChart.util._zJ = function (b, a) {
    var c = b.getBoundingClientRect();
    var d = a.touches[0].pageX - c.left;
    var f = a.touches[0].pageY - c.top;
    return Math.sqrt((d - t2x) * (d - t2x) + (f - t2y) * (f - t2y));
};
getOrgChart.util._4 = function (a) {
    var b = ["darkred", "pink", "darkorange", "orange", "lightgreen", "green", "lightteal", "teal", "lightblue", "blue", "darkpurple", "purple", "mediumdarkblue", "darkblue", "cordovan", "darkcordovan", "neutralgrey"];
    var c = b.indexOf(a);
    b.splice(c, 1);
    var d = Math.floor(Math.random() * 16 + 1);
    return b[d];
};
getOrgChart.util._ap = function (b, a) {
    var c = b.parent;
    if (a >= 0) {
        a++;
    } else {
        a = 0;
    }
    if (c) {
        return getOrgChart.util._ap(c, a);
    } else {
        return a;
    }
};


getOrgChart.prototype._k = function () {
    var a = this._X._K();
    if (this._X._M()) {
        this._q(this._X._M(), "change", this._j);
    }
};
getOrgChart.prototype._j = function (m, a) {
    var n = this._X._J();
    var l = this._X._M();
    var k = l.value;
    for (var d = 0; d < l.options.length; d++) {
        if (k == l.options[d].value) {
            l.options[d] = null;
        }
    }
    if (!k) {
        return;
    }
    var c = this._X._i.innerHTML;
    var e = c.indexOf('<select class="get-oc-labels">');
    this._X._i.innerHTML = c.substring(0, e) + f + c.substring(e, c.length);
    var b = this._X._U();
    var o = this;

    var g = this._X._K();
    var h = 0;
    for (d in n) {
        g[h].value = n[d];
        h++;
    }
    this._k();
};
getOrgChart.prototype._zi = function (e, a) {
    if (this._S) {
        var b = this._X._I().value;
        var d;
        if (this._X._O() && this._X._O().value) {
            d = this._X._O().value;
        }
        var c = this._X._J();
        this.updateNode(b, d, c);
        this._S = false;
    }
    this.showMainView();
};
getOrgChart.prototype._zV = function () {
    this.showGridView();
};
getOrgChart.prototype.showGridView = function () {
    var a = '<table cellpadding="0" cellspacing="0" border="0">';
    a += "<tr>";
    a += "<th>ID</th><th>Parent ID</th>";
    for (i = 0; i < this._ai.length; i++) {
        var c = this._ai[i];
        a += "<th>" + c + "</th>";
    }
    a += "</tr>";
    for (var b in this.nodes) {
        var d = this.nodes[b];
        var f = i % 2 == 0 ? "get-even" : "get-odd";
        var e = d.data;
        a += '<tr class="' + f + '">';
        a += "<td>" + d.id + "</td>";
        a += "<td>" + d.pid + "</td>";
        for (j = 0; j < this._ai.length; j++) {
            var c = this._ai[j];
            var g = e[c];
            a += "<td>";
            a += g ? g : "&nbsp;";
            a += "</td>";
        }
        a += "</tr>";
    }
    a += "</table>";
    this._X._0.innerHTML = a;
    this._X._t.style.top = "-9999px";
    this._X._t.style.left = "-9999px";
    this._X._u.style.top = "-9999px";
    this._X._u.style.left = "-9999px";
    this._X._0.style.top = 46 + "px";
    this._X._0.style.left = "0px";
    get._z(
        this._X._0,
        {
            left: 100,
            opacity: 0,
        },
        {
            left: 0,
            opacity: 1,
        },
        200,
        get._z._a5
    );
    get._z(
        this._X._zU,
        {
            top: 0,
        },
        {
            top: -46 * 2,
        },
        200,
        get._z._a7
    );
};
getOrgChart.prototype._zT = function (b, a) {
    this.showMainView();
};
getOrgChart.prototype.showMainView = function () {
    this._X._t.style.top = 46 + "px";
    this._X._t.style.left = "0px";
    this._X._u.style.top = "-9999px";
    this._X._u.style.left = "-9999px";
    this._X._0.style.top = "-9999px";
    this._X._0.style.left = "-9999px";
    this._X._0.innerHTML = "";
    if (this._X._zU.style.top != 0 && this._X._zU.style.top != "" && this._X._zU.style.top != "0px") {
        get._z(
            this._X._zU,
            {
                top: -46,
            },
            {
                top: 0,
            },
            200,
            get._z._a7
        );
    }
};
getOrgChart.prototype._zg = function (b, a) {
    this.print();
};
getOrgChart.prototype.print = function () {
    var b = this,
        d = this._X.element,
        k = null,
        g = [],
        h = d.parentNode,
        j = k.style.display,
        a = document.body,
        c = a.childNodes,
        e;
    if (b._an) {
        return;
    }
    b._an = true;
    for (e = 0; e < c.length; e++) {
        var f = c[e];
        if (f.nodeType === 1) {
            g[e] = f.style.display;
            f.style.display = "none";
        }
    }
    k.style.display = "none";
    a.appendChild(d);
    window.focus();
    window.print();
    setTimeout(function () {
        h.appendChild(d);
        for (e = 0; e < c.length; e++) {
            var i = c[e];
            if (i.nodeType === 1) {
                i.style.display = g[e];
            }
        }
        k.style.display = j;
        b._an = false;
    }, 1000);
};
getOrgChart.prototype._z6 = function () {
    this.zoom(true, true);
};
getOrgChart.prototype._z8 = function () {
    this.zoom(false, true);
};
getOrgChart.prototype._zl = function (b, a) {
    this._zp = this._X._u.scrollTop + a[0].touches[0].pageY;
};
getOrgChart.prototype._zo = function (b, a) {
    this._X._u.scrollTop = this._zp - a[0].touches[0].pageY;
};
getOrgChart.prototype._zQ = function (d, b) {
    this._X._n = undefined;
    var a = b[0].wheelDelta ? b[0].wheelDelta / 40 : b[0].detail ? -b[0].detail : 0;
    if (a) {
        var e = a > 0;
        var c = getOrgChart.util._aC(this._X._v, b[0].pageX, b[0].pageY);
        this.zoom(e, false, c);
    }
    return b[0].preventDefault() && false;
};
getOrgChart.prototype._zh = function (b, a) {
    var c = this;
    window.setTimeout(function () {
        c.resize();
    }, 300);
};

getOrgChart.prototype._aX = function (b, a) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = "none";
    var c = getOrgChart.util._8(this._X);
    this._a8.dragStart = {
        x: a[0].pageX - this._X._t.offsetLeft,
        y: a[0].pageY - this._X._t.offsetTop,
        viewBoxLeft: c[0],
        viewBoxTop: c[1],
    };
};
getOrgChart.prototype._aD = function (b, a) {
    this._a8.dragStart = null;
    this._X._t.style.cursor = "default";
};
getOrgChart.prototype.zoom = function (c, a, b) {
    if (this._z4) {
        return false;
    }
    this._z4 = true;
    var i = this;
    var j = getOrgChart.util._8(this._X);
    var f = j.slice(0);
    var h = j[2];
    var g = j[3];
    if (c === true) {
        j[2] = j[2] / (getOrgChart.SCALE_FACTOR * 1.2);
        j[3] = j[3] / (getOrgChart.SCALE_FACTOR * 1.2);
    } else {
        if (c === false) {
            j[2] = j[2] * (getOrgChart.SCALE_FACTOR * 1.2);
            j[3] = j[3] * (getOrgChart.SCALE_FACTOR * 1.2);
        } else {
            j[2] = j[2] / c;
            j[3] = j[3] / c;
        }
    }
    if (!b) {
        b = [50, 50];
    }
    j[0] = f[0] - (j[2] - h) / (100 / b[0]);
    j[1] = f[1] - (j[3] - g) / (100 / b[1]);
    var d = this._a0 / j[2];
    var e = this._a9 / j[3];
    this.scale = d > e ? e : d;
    if (this.scale < this.minScale) {
        this.scale = this.minScale;
        j[2] = this._a0 / this.scale;
        j[3] = this._a9 / this.scale;
        j[0] = f[0] - (j[2] - h) / (100 / b[0]);
        j[1] = f[1] - (j[3] - g) / (100 / b[1]);
    }
    if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
        j[2] = this._a0 / this.scale;
        j[3] = this._a9 / this.scale;
        j[0] = f[0] - (j[2] - h) / (100 / b[0]);
        j[1] = f[1] - (j[3] - g) / (100 / b[1]);
    }
    if (a) {
        get._z(
            this._X._v,
            {
                viewBox: f,
            },
            {
                viewBox: j,
            },
            300,
            get._z._a3,
            function () {
                i._z4 = false;
            }
        );
    } else {
        this._X._v.setAttribute("viewBox", j.toString());
        this._z4 = false;
    }
    return false;
};
getOrgChart.prototype._aG = function (c, b) {
    if (c.className.indexOf("get-disabled") > -1) {
        return false;
    }
    var a = this;
    clearTimeout(this._zA.timer);
    this._zA.timer = setTimeout(function () {
        a._zA.currentIndex++;
        a._l();
        a._az();
    }, 100);
};
getOrgChart.prototype._zf = function (c, b) {
    if (c.className.indexOf("get-disabled") > -1) {
        return false;
    }
    var a = this;
    clearTimeout(this._zA.timer);
    this._zA.timer = setTimeout(function () {
        a._zA.currentIndex--;
        a._l();
        a._az();
    }, 100);
};
getOrgChart.prototype._zW = function (c, b) {
    var a = this;
    clearTimeout(this._zA.timer);
    this._zA.timer = setTimeout(function () {
        a._zA.found = a._F(a._X._zZ.value);
        a._zA.currentIndex = 0;
        a._l();
        a._am();
        a._az();
    }, 500);
};
getOrgChart.prototype._zS = function (c, b) {
    var a = this;
    clearTimeout(this._zA.timer);
    this._zA.timer = setTimeout(function () {
        a._zA.currentIndex = 0;
        a._zA.found = a._F(a._X._zZ.value);
        a._am();
        a._l();
        a._az();
    }, 100);
};
getOrgChart.prototype._az = function () {
    if (this._zA.found.length) {
        this.highlightNode(this._zA.found[this._zA.currentIndex].node.id);
    }
};
getOrgChart.prototype.highlightNode = function (c) {
    var a = this;

    function b() {
        var d = a.nodes[c];
        var e = getOrgChart.util._8(a._X);
        var f = d.x - a.initialViewBoxMatrix[2] / 2 + d.w / 2;
        var g = d.y - a.initialViewBoxMatrix[3] / 2 + d.h / 2;
        a.move([f, g, a.initialViewBoxMatrix[2], a.initialViewBoxMatrix[3]], null, function () {
            var i = a._X.getNodeById(c);
            var h = getOrgChart.util._6(i);
            var j = h.slice(0);
            j[0] = getOrgChart.HIGHLIGHT_SCALE_FACTOR;
            j[3] = getOrgChart.HIGHLIGHT_SCALE_FACTOR;
            j[4] = j[4] - (d.w / 2) * (getOrgChart.HIGHLIGHT_SCALE_FACTOR - 1);
            j[5] = j[5] - (d.h / 2) * (getOrgChart.HIGHLIGHT_SCALE_FACTOR - 1);
            get._z(
                i,
                {
                    transform: h,
                },
                {
                    transform: j,
                },
                200,
                get._z._ab,
                function (k) {
                    get._z(
                        k[0],
                        {
                            transform: j,
                        },
                        {
                            transform: h,
                        },
                        200,
                        get._z._a7,
                        function () { }
                    );
                }
            );
        });
    }
    if (this.isCollapsed(this.nodes[c])) {
        this.expand(this.nodes[c].parent, b);
    } else {
        b();
    }
};
getOrgChart.prototype._am = function (a) { };
getOrgChart.prototype._l = function () {
    if (this._zA.currentIndex < this._zA.found.length - 1 && this._zA.found.length != 0) {
        this._X._aT.className = this._X._aT.className.replace(" get-disabled", "");
    } else {
        if (this._X._aT.className.indexOf(" get-disabled") == -1) {
            this._X._aT.className = this._X._aT.className + " get-disabled";
        }
    }
    if (this._zA.currentIndex != 0 && this._zA.found.length != 0) {
        this._X._zr.className = this._X._zr.className.replace(" get-disabled", "");
    } else {
        if (this._X._zr.className.indexOf(" get-disabled") == -1) {
            this._X._zr.className = this._X._zr.className + " get-disabled";
        }
    }
};
getOrgChart.prototype._F = function (g) {
    var e = [];
    if (g == "") {
        return e;
    }
    if (g.toLowerCase) {
        g = g.toLowerCase();
    }
    for (var b in this.nodes) {
        var f = this.nodes[b];
        for (m in f.data) {
            if (m == this.config.photoFields[0]) {
                continue;
            }
            var c = -1;
            if (getOrgChart.util._ah(f) && getOrgChart.util._ah(f.data[m])) {
                var d = f.data[m].toString().toLowerCase();
                c = d.indexOf(g);
            }
            if (c > -1) {
                e.push({
                    indexOf: c,
                    node: f,
                });
                break;
            }
        }
    }

    function a(h, i) {
        if (h.indexOf < i.indexOf) {
            return -1;
        }
        if (h.indexOf > i.indexOf) {
            return 1;
        }
        return 0;
    }
    e.sort(a);
    return e;
};
getOrgChart.prototype._aK = function (g, a) {
    var c = g.getAttribute("data-node-id");
    var e = this.nodes[c];
    var f = e.x + e.w - 15;
    var d = e.x - 30;
    var h = e.y - 30;
    var b = e.y + e.h - 15;
};
getOrgChart.prototype._aI = function (i, c) {
    var b = c[0];
    b.preventDefault();
    this._aK(i, c);
    var h = new Date().getTime();
    var k = this;
    if (this._aM == null) {
        this._aM = {
            time: h,
        };
        return;
    }
    if (b.touches && b.touches.length && b.touches.length > 1) {
        this._aM = null;
        return;
    }

    var l = h - this._aM.time;
    if (l < 400 && l > 0) {
        this._a8.dragStart = null;
        var d = i.getAttribute("data-node-id");
        var g = this.nodes[d];
        var m = getOrgChart.util._8(this._X);
        var f = m.slice(0);
        if (!this._aM.viewBox || this._aM.id != d) {
            var f = getOrgChart.util._8(this._X);
            var a = f[2] / f[3];
            f[2] = g.w * 1.5;
            f[3] = f[2] / a;
            f[0] = g.x - g.w / 4;
            f[1] = g.y - f[3] / 2 + g.h / 2;
            this.move(f);
            if (this._aM.viewBox) {
                m = this._aM.viewBox;
            }
            this._aM = {
                id: d,
                viewBox: m,
            };
        } else {
            this.move(this._aM.viewBox);
            this._aM = null;
        }
    }
    if (this._aM) {
        this._aM.time = h;
    }
};
getOrgChart.prototype._zD = function (a, d, e, c) {
    if (a != "details") {
        var b = this._X.getButtonByType(a);
        b.style.display = "block";
        b.setAttribute("transform", "matrix(0.14,0,0,0.14," + d + "," + e + ")");
        b.setAttribute("data-btn-id", c);
    }
};
get._z._arrastaDiagrama = function (a) {
    if (a < 0) {
        return 0;
    }
    if (a > 1) {
        return 1;
    }
    return Math.pow(2, 10 * (a - 1));
};
getOrgChart.prototype._aH = function (d, a) {
    var b = d.getAttribute("data-node-id");
    var c = this.nodes[b];
    if (
        !this._V("clickNodeEvent", {
            node: c,
        })
    ) {
        return;
    }
};
getOrgChart.prototype._aY = function (d, b) {
    b[0].preventDefault();
    var c = d.getAttribute("data-btn-id");
    var a = d.getAttribute("data-btn-action");

    if (a == "add") {
        console.log("2");
        this.insertNode(c);
    } else {
        if (a == "details") {
            console.log("3");
        } else {
            if (a == "expColl") {
                console.log("5");
                this.expandOrCollapse(c);
            }
        }
    }
};

getOrgChart.prototype.expand = function (b, a) {
    var c = this;
    b.collapsed = getOrgChart.EXPANDED;
    this.expand(b.parent, a);
};
getOrgChart.prototype.expandOrCollapse = function (a) {
    var c = this;
    var b = this.nodes[a];
    this._a2 = {
        id: a,
        old_x: b.x,
        old_y: b.y,
    };
    if (b.collapsed == getOrgChart.EXPANDED) {
        b.collapsed = getOrgChart.COLLAPSED;
    } else {
        b.collapsed = getOrgChart.EXPANDED;
    }

};
getOrgChart.prototype.moveToMostDeepChildForNode = function (b) {
    var c = getOrgChart.util._8(this._X);
    b = b.getMostDeepChild(this.nodes);
    var d = this.config.siblingSeparation / 2;
    var e = this.config.levelSeparation / 2;
    var a = c.slice(0);
    switch (this.config.orientation) {
        case getOrgChart.RO_TOP:
        case getOrgChart.RO_TOP_PARENT_LEFT:
            a[1] = b.y + b.h - c[3] + e;
            if (c[1] < a[1]) {
                this.move(a);
            }
            break;
        case getOrgChart.RO_BOTTOM:
        case getOrgChart.RO_BOTTOM_PARENT_LEFT:
            a[1] = b.y - e;
            if (c[1] > a[1]) {
                this.move(a);
            }
            break;
        case getOrgChart.RO_RIGHT:
        case getOrgChart.RO_RIGHT_PARENT_TOP:
            a[0] = b.x - d;
            if (c[0] > a[0]) {
                this.move(a);
            }
            break;
        case getOrgChart.RO_LEFT:
        case getOrgChart.RO_LEFT_PARENT_TOP:
            a[0] = b.x + b.w - c[2] + d;
            if (c[0] < a[0]) {
                this.move(a);
            }
            break;
    }
};

getOrgChart.prototype.insertNode = function (e, b, c) {
    var a = {
        id: c,
        pid: e,
        data: b,
    };
    if (!this._V("insertNodeEvent", a)) {
        return;
    }
    b = a.data;
    e = a.pid;
    c = a.id;
    var g = this;
    var f = this.nodes[e];
    this._a2 = {
        id: e,
        old_x: f.x,
        old_y: f.y,
    };
    if (c == undefined) {
        c = getOrgChart.util._G(this.nodes);
    }
    if (b == undefined || b == null) {
        b = {};
        this.config.camposPrimarios.forEach(function (h) {
            b[h] = h;
        });
    }
    var d = this._h(c, e, null, b, false);
    d.x = f.x;
    d.y = f.y;

    return d;
};


getOrgChart.prototype._h = function (d, f, g, c, a, b) {
    var h = this.theme;
    a = a == undefined ? getOrgChart.NOT_DEFINED : a;
    var e = new getOrgChart.node(d, f, g, c, [500, 220], null, a, b);
    if (
        !this._V("createNodeEvent", {
            node: e,
        })
    ) {
        return null;
    }
    if (this.nodes[d]) {
        e._z2 = this.nodes[d].x;
        e._z3 = this.nodes[d].y;
    } else {
        e._z2 = null;
        e._z3 = null;
    }
    this.nodes[d] = e;
    for (label in e.data) {
        if (!getOrgChart.util._s(this._ai, label)) {
            this._ai.push(label);
        }
    }
    return e;
};

getOrgChart.prototype.load = function () {
    var a = this.config.dataSource;
    if (!a) {
        return;
    }
    if (a.constructor && a.constructor.toString().indexOf("HTML") > -1) {
        this.loadFromHTMLTable(a);
    } else {
        if (typeof a == "string") {
            this.loadFromXML(a);
        } else {
            a = JSON.parse(JSON.stringify(this.config.dataSource));
            this.loadFromJSON(a);
        }
    }
};

getOrgChart.prototype.loadFromJSON = function (g, q, a) {
    this._zm = 0;
    this._zj = 0;
    this._zu = new getOrgChart.node(-1, null, null, null, 2, 2);
    if (q) {
        for (var e in g) {
            if (this.nodes[e] && !this.nodes[e].isVisible()) {
                this.nodes[e].x = this.nodes[e].parent.x;
                this.nodes[e].y = this.nodes[e].parent.y;
            }
            this._h(e, g[e].pid, g[e].spid, g[e].data, g[e].collapsed, g[e].color);
        }
    } else {
        var f = Object.keys(g[0])[0];
        var m = Object.keys(g[0])[1];
        var s = null;
        if (this.config.idField) {
            f = this.config.idField;
        }
        if (this.config.parentIdField) {
            m = this.config.parentIdField;
        }
        if (this.config.secondParentIdField) {
            s = this.config.secondParentIdField;
        }
        for (var d = 0; d < g.length; d++) {
            var e = g[d][f];
            var n = g[d][m];
            var t = null;
            delete g[d][f];
            delete g[d][m];
            if (s != null) {
                t = g[d][s];
                delete g[d][s];
            }
            this._h(e, n, t, g[d]);
        }
    }
    for (var e in this.nodes) {
        var l = this.nodes[e];
        var o = this.nodes[l.pid];
        if (!o) {
            o = this._zu;
        }
        l.parent = o;
        var c = o.children.length;
        o.children[c] = l;
        if (l.spid != null && l.spid != "") {
            var u = this.nodes[l.spid];
            l.secondParent = u;
            var p = u.secondChildren.length;
            u.secondChildren[p] = l;
        }
    }
    if (this.config.layout == getOrgChart.MIXED_HIERARCHY_RIGHT_LINKS) {
        for (var e in this.nodes) {
            var l = this.nodes[e];
            var j = getOrgChart.util._ap(l);
            l.l = j;
            if (j > this.maxLevel) {
                this.maxLevel = j;
            }
        }
        for (var e in this.nodes) {
            var l = this.nodes[e];
            if (l.l < this.maxLevel) {
                continue;
            }
            var o = this.nodes[l.pid];
            var k = e;
            if (l.children.length == 0) {
                for (z = 0; z < o.children.length; z++) {
                    var b = o.children[z];
                    if (b.children.length == 0 && b != this.nodes[k] && b.displayPid == null && b.displayChildren == null) {
                        if (this.nodes[k].color == null) {
                            this.nodes[k].color = getOrgChart.util._4(this.config.color);
                        }
                        b.color = this.nodes[k].color;
                        b.displayPid = k;
                        b.displayParent = this.nodes[k];
                        if (this.nodes[k].displayChildren == null) {
                            this.nodes[k].displayChildren = [];
                        }
                        var c = this.nodes[k].displayChildren.length;
                        this.nodes[k].displayChildren[c] = b;
                        k = b.id;
                    }
                }
            }
        }
    }
    this.draw(a);
};

getOrgChart.prototype._arrastaDiagrama = function (g, b) {
    this._X._n = undefined;
    if (this._a8.dragStart) {
        this._X._t.style.cursor = "move";
        var e = b[0].pageX - this._X._t.offsetLeft;
        var f = b[0].pageY - this._X._t.offsetTop;
        var j = getOrgChart.util._8(this._X);
        var k = j[2] / this._a0;
        var c = j[3] / this._a9;
        var a = k > c ? k : c;
        j[0] = -((e - this._a8.dragStart.x) * a) + this._a8.dragStart.viewBoxLeft;
        j[1] = -((f - this._a8.dragStart.y) * a) + this._a8.dragStart.viewBoxTop;
        j[0] = parseInt(j[0]);
        j[1] = parseInt(j[1]);
        this._X._v.setAttribute("viewBox", j.toString());
    }
};
