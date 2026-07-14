class EditorEventSystem {
    constructor() {
        this.events = {};
        this._lookupIDEvent = new Map();
        this._idCounter = 0;
    }

    listen(eventType, callback) {
        // type checks
        if (typeof callback !== 'function') {
            throw new Error("Editor event construct (editorObject.event.listen) (s) second input (callback) must be of type \'function\'");
        }

        // real code
        if (!this.events[eventType]) this.events[eventType] = {};
        this.events[eventType][this._idCounter] = callback;

        this._lookupIDEvent.set(this._idCounter, eventType);
        return this._idCounter++; // returns the right id but also increments it after
    }

    lookup(eventID) {
        eventID = Number(eventID);

        const eventTypeName = this._lookupIDEvent.get(eventID);
        if (eventTypeName === undefined) return null;

        const eventType = this.events[eventTypeName];
        if (eventType === undefined) return null;

        const callback = eventType[eventID];
        if (callback === undefined) return null;

        return callback;
    }

    remove(eventID) {
        eventID = Number(eventID);

        const eventTypeName = this._lookupIDEvent.get(eventID);

        if (eventTypeName === undefined) {
            throw new Error("event.remove: no event found matching the given ID");
        }

        const eventType = this.events[eventTypeName];
        if (!eventType) {
            throw new Error("event.remove: event type entry missing for the given ID");
        }

        delete eventType[eventID];
        this._lookupIDEvent.delete(eventID);
    }

    create(eventType) {
        if (!this.events[eventType]) this.events[eventType] = {};
    }

    signal(eventType, eventData) {
        // type checks
        if (Object.getPrototypeOf(eventData) !== Object.prototype) {
            throw new Error("Editor event call (editorObject.event.signal) (s) second input (eventData) must be a primitive object");
        }

        if (!this.events[eventType]) {
            throw new Error("Editor signaling event that does not exist")
        }

        // real code
        let identifications = Object.keys(this.events[eventType]);
        identifications = identifications.sort((a, b) => b - a);

        let _preventPropagationSwitch = false;

        const event = {
            ...eventData,
            preventPropagation() {
                _preventPropagationSwitch = true;
            }
        };

        for (let callbackID of identifications) {
            const callback = this.lookup(callbackID);
            if (callback === null) continue;

            callback(event);

            if (_preventPropagationSwitch) {
                break;
            }
        }
    }
};
