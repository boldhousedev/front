/**
 * Class/Instance Locator
 */

import _ from 'underscore-bd';
import Bb from 'backbone';
import debug from './debug';

var locator = new (Bb.Collection.extend({
    model: Bb.Model.extend({
        add: function (alias, obj) {
            obj.yid = _.uniqueId(this.id);
            this.set(['list', alias].join('.'), obj);
            return obj;
        },
        read: function (alias) {
            return this.get(['list', alias].join('.'));
        }
    }),
    initialize() {
        this.attributes = {};
    },
    /**
     * Used to set a unique class or instance
     */
    addItem(alias, obj, replace = false) {
        if (!this.getItem(alias) || replace) {
            (this.attributes[alias] = obj);
            return obj;
        }
        debug.error('There\'s already an Item with the alias "' + alias + '"');
        return this.getItem(alias);
    },
    /**
     * Used to get a unique class or instance
     */
    getItem(name) {
        return (name in this.attributes) ? this.attributes[name] : null;
    },
    /**
     * Used to set a new list of items
     */
    setNewList(name) {
        !this.get(name) && this.push(new (this.model)({ id: name }));
        return true;
    },
    /**
     * Used to add an item to a list
     */
    addListItem(list, alias, obj, replace = false) {
        this.setNewList(list);
        if (replace || !this.getListItem(list, alias)) {
            this.get(list).add(alias, obj);
            return obj;
        }
        debug.error('There\'s already an Item with the alias "' + alias + '" on the list called "' + list + '"');
        return this.getListItem(list, alias);
    },
    /**
     * Used to find an item on a list
     */
    getListItem(list, id, create = null, replace = false) {
        this.setNewList(list);
        if (!(this.get(list) && this.get(list).read(id) && (!replace))) {
            //            typeof create === 'function' && this.get(list).add(id, create());
            typeof create === 'function' && create().Mark(id, replace);
        }

        return this.get(list).read(id);
    },
    find(item, id = null) {
        return id ? this.getListItem(item, id) : this.getItem(item);
    }
}));

export default locator;
