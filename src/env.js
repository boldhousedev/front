import constants from "./constants";

var o = {};

o.name = function (env) {
    const envs = {};
    envs[constants.env.development] = "development";
    envs[constants.env.testing] = "testing";
    envs[constants.env.staging] = "staging";
    envs[constants.env.production] = "production";

    return envs[env];
};

export default o;
