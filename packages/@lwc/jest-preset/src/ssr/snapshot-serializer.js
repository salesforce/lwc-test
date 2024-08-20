// Custom snapshot serializer plugin
const jestCustomSnapshotSerializer = {
    // Store dynamic values
    dynamicValues: new Map(),

    /**
     * Serializes the stored markup string for snapshotting.
     *
     * @returns {string} The serialized markup string.
     */
    serialize: function() {
      return this.dynamicValues.get('renderedComponent') || '';
    },

    /**
     * Determines if this serializer can handle the given value.
     *
     * @param {*} _value - The value to test.
     * @returns {boolean} A boolean indicating if the serializer can handle the value.
     */
    test: function(_value) {
      return typeof _value === 'string' && _value.length > 0;
    },

    /**
     * Sets a dynamic value to be used in the snapshot.
     *
     * @param {string} key - The key under which the value is stored.
     * @param {string} value - The string value to be stored.
     */
    setDynamicValue: function(key, value) {
      this.dynamicValues.set(key, value);
    },
  };

  module.exports = { jestCustomSnapshotSerializer };
