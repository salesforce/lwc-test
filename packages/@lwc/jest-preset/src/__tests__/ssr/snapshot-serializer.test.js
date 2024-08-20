const { jestCustomSnapshotSerializer } = require('../../ssr/snapshot-serializer');

describe('jestCustomSerializer', () => {
  const renderedComponent = '<div>SSR snapshot testing</div>';

  beforeEach(() => {
    jestCustomSnapshotSerializer.dynamicValues.clear();
  });

  describe('Serialization of markup strings', () => {
    it('correctly serializes a provided markup string', () => {
      jestCustomSnapshotSerializer.setDynamicValue('renderedComponent', renderedComponent);
      const result = jestCustomSnapshotSerializer.serialize();
      expect(result).toBe(renderedComponent);
    });

    it('returns an empty string when no markup is set', () => {
      const result = jestCustomSnapshotSerializer.serialize();
      expect(result).toBe('');
    });
  });

  describe('Content type validation for serialization', () => {
    it('returns true for string values', () => {
      const result = jestCustomSnapshotSerializer.test(renderedComponent);
      expect(result).toBe(true);
    });

    it('returns false for non-string values', () => {
      const result = jestCustomSnapshotSerializer.test(0);
      expect(result).toBe(false);
    });
  });
});
