var TemporalHash = require('../src/index');

describe('temporal hash', function() {
  //['resolve', 'compact'].forEach(function(method) {
  ['compact', 'resolve'].forEach(function(method) {
    describe(method, function() {
      it('returns the hash provided at instantiation', function() {
        var timeHash = new TemporalHash({value: 'A'});

        expect(timeHash[method]().value).toBe('A');
      });

      it('does not require a hash when created', function() {
        var timeHash = new TemporalHash();

        timeHash.update({a: 10});

        expect(timeHash[method]().a).toBe(10);
      });

      it('returns the most recent value for the given key', function() {
        var timeHash = new TemporalHash({value: 'A'});

        timeHash.update({value: 'B'});

        expect(timeHash[method]().value).toBe('B');
      });

      it('modifies the hash by inserting new values', function() {
        var timeHash = new TemporalHash({value: 'A'});

        timeHash.update({value: 'B', planet: 'Venus'});

        expect(timeHash[method]().value).toBe('B');
        expect(timeHash[method]().planet).toBe('Venus');
      });

      it('does not change existing key-values that are not in provided hash', function() {
        var timeHash = new TemporalHash({value: 'A', mode: 'stealth'});

        timeHash.update({value: 'B'});

        expect(timeHash[method]().mode).toBe('stealth');
        expect(timeHash[method]().value).toBe('B');
      });

      it('does not override existing key value if value is from a later time', function() {
        var timeHash = new TemporalHash();
        var timeNow = Date.now();
        var timePast = timeNow - 100;
        timeHash.update({medium: 'message'}, timeNow);

        timeHash.update({medium: 'lsd'}, timePast);

        expect(timeHash[method]().medium).toBe('message');
      });

      it('preserves key values with late time but overwrites those with an earlier time', function() {
        var timeNow = Date.now();
        var timePast = timeNow - 100;
        var timeFuture = timeNow + 100;
        var timeHash = new TemporalHash({movie: 'Random'}, timePast);
        timeHash.update({name: 'Ebert'}, timeFuture);

        timeHash.update({name: 'Siskel', movie: 'Moo'}, timeNow);

        expect(timeHash[method]().name).toBe('Ebert');
        expect(timeHash[method]().movie).toBe('Moo');
      });

      it('works correctly with nested values', function() {
        var timeNow = Date.now();
        var timeFuture = timeNow + 100;
        var timeHash = new TemporalHash({people: {a: {b: 2, c: 3}}});

        timeHash.update({people: {a: {c: 5}}});

        expect(timeHash[method]().people.a.b).toBe(2);
        expect(timeHash[method]().people.a.c).toBe(5);
      });

      it('handles update with same timestamp multiple times', function() {
        var timeHash = new TemporalHash();

        timeHash.update({a: 10}, 0);
        timeHash.update({b: 20}, 0);

        expect(timeHash[method]().a).toBe(10);
        expect(timeHash[method]().b).toBe(20);
      });

      it('overwrites with most recent call when timestamps are same', function() {
        var timeHash = new TemporalHash();

        timeHash.update({a: 10}, 0);
        timeHash.update({a: 500}, 0);

        expect(timeHash[method]().a).toBe(500);
      });

      it('removes a key if a later hash has the key set to null', function() {
        var timeHash = new TemporalHash();

        timeHash.update({a: 10, q: 3}, 250);
        timeHash.update({a: 42, q: null}, 500);

        expect(timeHash[method]().a).toBe(42);
        expect(timeHash[method]().q).toBe(null);
      });

      it('returns a copy of the hash -- cannot change internal data', function() {
        var timeHash = new TemporalHash();

        timeHash.update({name: 'Cymen'});
        var hash = timeHash[method]();
        hash.name = 'John';

        expect(timeHash[method]().name).toBe('Cymen');
      });

      it('returns a deep copy of the hash', function() {
        var timeHash = new TemporalHash();

        timeHash.update({students: [{name: 'Bob'}]});
        var hash = timeHash[method]();
        hash.students[0].name = 'Jim';

        expect(timeHash[method]().students[0].name).toBe('Bob');
      });
    });
  });
});
