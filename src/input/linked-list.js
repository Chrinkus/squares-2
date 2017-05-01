/* Linked List
 *
 * This implementation is not a fully-featured linked list, it only has the
 * parts that I need for queuing game actions
 */

function LinkedList(val, next) {
    "use strict";
    this.val = val;
    this.next = next || null;
}

LinkedList.prototype.addItem = function(val) {
    if (this.val) {
        this.next = new LinkedList(this.val, this.next);
    }
    this.val = val;
};

LinkedList.prototype.removeItem = function(val, prev) {
    if (this.val === val) {
        if (this.next) {
            this.val = this.next.val;
            this.next = this.next.next;
        } else {
            this.val = null;
            if (prev) {
                prev.next = null;
            }
        }
    } else {
        this.next.removeItem(val, this);
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = LinkedList;
}
