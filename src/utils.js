/**
 *
 */
import _ from "underscore-bd";
import Bb from "backbone";

var utils = {};

/**
 * Wait for a function return to be true before executes another function
 * @param waitFunction function
 * @param afterWait function
 * @param interval integer microseconds interval between checks
 */
utils.when = function (
    waitFunction,
    afterWait,
    interval,
    afterPassed,
    passed = 0
) {
    var test = waitFunction();
    !interval && (interval = 200);

    if (!test) {
        let afterPassedEndProccess =
            typeof afterPassed === "function" ? afterPassed(passed) : false;
        if (afterPassedEndProccess === true) {
            return;
        }

        return _.delay(
            _.bind(
                function (
                    waitFunction,
                    afterWait,
                    interval,
                    afterPassed,
                    passed
                ) {
                    passed += interval;
                    utils.when(
                        waitFunction,
                        afterWait,
                        interval,
                        afterPassed,
                        passed
                    );
                },
                this,
                waitFunction,
                afterWait,
                interval,
                afterPassed,
                passed
            ),
            interval
        );
    }

    afterWait();
};

/**
 * Catch paste value
 * @param evt event
 * @param elem function
 * @param interval integer microseconds interval between checks
 */
utils.catchPaste = function (e, el, c) {
    if (navigator.clipboard && navigator.clipboard.readText) {
        // modern approach with Clipboard API
        navigator.clipboard.readText().then(c);
    } else if (e.originalEvent && e.originalEvent.clipboardData) {
        // OriginalEvent is a property from jQuery, normalizing the event object
        c(e.originalEvent.clipboardData.getData("text"));
    } else if (e.clipboardData) {
        // used in some browsers for clipboardData
        c(e.clipboardData.getData("text/plain"));
    } else if (window.clipboardData) {
        // Older clipboardData version for Internet Explorer only
        c(window.clipboardData.getData("Text"));
    } else {
        // Last resort fallback, using a timer
        setTimeout(() => {
            c(el.value);
        }, 100);
    }
};

utils.addCssTag = function (o, preload = true, head = true) {
    !_.isObject(o) && (o = { href: o });
    var d = !preload
        ? {
            rel: "stylesheet",
            type: "text/css",
        }
        : {
            type: "text/css",
            rel: "preload",
            onload: "this.rel='stylesheet';document.onloadFired=true",
            as: "style",
            media: "all",
        };

    o = _.defaults(o, d);

    var link = document.createElement("link");
    _.each(o, (v, k) => {
        link[k] = v;
    });

    document[head ? "head" : "body"].appendChild(link);
    return link;
};

utils.addCssTagAfterDocumentLoad = function (o, preload = true, head = true) {
    var link = utils.addCssTag(o, preload, head);
    if (preload && document.onloadFired)
        setTimeout(() => (link.rel = "stylesheet"), 10);
};

window.URL = window.URL || window.webkitURL;
utils.openBlobPDF = function (url) {
    Bb.ajax({
        url: url,
        method: "GET",
        xhrFields: {
            responseType: "blob",
        },
        success(response) {
            utils.openBlob(response);
        },
    });
};

utils.openBlob = function (content, type, filename) {
    if (type) content = new Blob(content, { type });

    var fileURL = URL.createObjectURL(content);
    if (!filename) window.open(fileURL);
    else {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = fileURL;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(fileURL);
    }
};

utils.geolocation = function (c) {
    var s = (position) => {
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
    },
        e = (err) => {
            return { code: (err && err.code) || 0 };
        };

    if (!navigator.geolocation) {
        return c(e());
    }
    navigator.geolocation.getCurrentPosition(
        (data) => c(s(data)),
        (err) => c(e(err))
    );
};

utils.file = {};
utils.file.getData = function ($el) {
    var el = $el.get(0),
        files = el?.files;

    return files ? files[0] : null;
}

utils.file.getDataURL = function ($el, c) {
    var file = utils.file.getData($el);
    if (!file) return c(false);

    var reader = new FileReader();
    reader.onloadend = function (e) {
        c(true, e.target.result);
    };
    return reader.readAsDataURL(file);
}

export default utils;
