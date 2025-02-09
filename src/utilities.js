"use strict";
const { GLib } = imports.gi;

let clearTimeout, clearInterval;
clearInterval = clearTimeout = GLib.Source.remove;

var setTimeout = function(func, delay, ...args) {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
        func(...args);
        return GLib.SOURCE_REMOVE;
    });
};

var setInterval = function(func, delay, ...args) {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
        func(...args);
        return GLib.SOURCE_CONTINUE;
    });
};

const get_process_name_from_window = function (v) {
  try {
    let pwithnew = GLib.spawn_command_line_sync(
      `ps -p ${v.get_pid()} -o comm=`
    )[1]+"";
    return pwithnew.replace(/\n/g, "");
  } catch (e) {
    return "";
  }
}

var easeOutQuad = function(t, begin, end, duration) {
    t /= duration
    return begin + (t * (2 - t) * (end - begin))
};

var ease_property = function(object, property, begin, end, duration, update) {
    let start = Date.now();
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, update, () => {
        let time = Date.now() - start;
        if (time < duration) {
            object[property] = easeOutQuad(time, begin, end, duration);
            return GLib.SOURCE_CONTINUE;
        } else {
            object[property] = end;
            return GLib.SOURCE_REMOVE;
        }
    });
};