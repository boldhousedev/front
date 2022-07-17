import extend from "./extend";
import constants from "./constants";
import debug from "./debug";
import events from "./events";
import locator from "./locator";
import utils from "./utils";
import env from "./env";

var front = {};

front.constants = constants;
front.debug = debug;
front.events = events;
front.locator = locator;
front.utils = utils;
front.env = env;

export default front;
