import _ from "underscore-bd";
import constants from "./constants";

var debug = {};

debug.c = 0;

debug.log = function () {
    if (_.result(this, "environment") === constants.env.development) {
        var args = Array.from(arguments);
        args.unshift((++debug.c).toString().padStart(4, "0"));
        console.log.apply(null, args);
    }
};

debug.error = function () {
    if (_.result(this, "environment") === constants.env.development) {
        var args = Array.from(arguments);
        args.unshift((++debug.c).toString().padStart(4, "0"));
        console.error.apply(null, args);
    }
};

debug.globalify = function (name, obj) {
    if (_.result(this, "environment") === constants.env.development) {
        window[name] = obj;
    }
};

debug.environment = constants.env.production;

export default debug;
