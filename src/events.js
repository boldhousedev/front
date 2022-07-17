/**
 * Prevent default event
 * @param e event
 */
const preventDefault = function (e)
{
    if (!e)
        return;

    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
};

/**
 * Prevent propagation
 * @param e event
 */
const stopAll = function (e)
{
    e.stopPropagation();
    this.preventDefault(e);
};

export default Object.freeze({
    preventDefault: preventDefault,
    stopAll: stopAll,
});
