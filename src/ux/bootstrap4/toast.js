import _ from 'underscore-bd';
import toastTpl from './toast.jst';

var toasts = [];

var setContainer = function (opts) {
    var $p = $('body > .toasts');

    !$p.length && ($p = $('<div class="toasts">').appendTo($('body')).css('position', 'fixed').css(opts.positionY || 'bottom', '10px').css(opts.positionX || 'right', '10px'));

    return $p;
}

var removeAll = function () {
    toasts.forEach(($el) => {
        $el.toast('hide');
        setTimeout(() => {
            $el.remove();
        }, Number($el.attr('data-delay')) + 500);
    });
}

var add = function (opts = {}) {
    var $p = $p = setContainer(opts);
    if (!opts.msg) { return; }
    opts = _.defaults(opts, { close: false, autohide: true, delay: opts.delay || 2500 });

    var tpl = toastTpl(_.extend({ color: 'info' }, opts)), $el;


    toasts.push($el = $(tpl).appendTo($p));
    $el.attr('data-delay', opts.delay);
    $el.toast(opts).toast('show');
    opts.autohide && setTimeout(_.partial(($el) => {
        $el.remove();
    }, $el), opts.delay + 500);
}

export default {
    add, removeAll
}