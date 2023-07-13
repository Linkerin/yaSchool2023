module.exports = Sequence;

function Sequence(from, to, step) {
  if (typeof new.target === 'undefined') return new Sequence(from, to, step);

  const fromSymbol = Symbol.for('from');
  const toSymbol = Symbol.for('to');
  const stepSymbol = Symbol.for('step');
  const currentSymbol = Symbol.for('current');

  this[fromSymbol] = from;
  this[toSymbol] = to;
  this[stepSymbol] = step;
  this[currentSymbol] = from;

  return this;
}

Sequence.prototype = {
  [Symbol.iterator]: function* () {
    const to = this[Symbol.for('to')];
    const from = this[Symbol.for('from')];
    const step = this[Symbol.for('step')];

    if (to < from) {
      for (let x = Math.ceil(from); x >= to; x -= step) {
        this[Symbol.for('current')] = x;
        yield x;
      }
    } else {
      for (let x = Math.ceil(from); x <= to; x += step) {
        this[Symbol.for('current')] = x;
        yield x;
      }
    }
  },

  // tag for toString() call
  [Symbol.toStringTag]: 'SequenceOfNumbers',

  [Symbol.toPrimitive]: function (hint) {
    const to = this[Symbol.for('to')];
    const from = this[Symbol.for('from')];
    const step = this[Symbol.for('step')];

    switch (hint) {
      case 'string':
        return `Sequence of numbers from ${from} to ${to} with step ${step}`;

      case 'number':
        return [...this].length;

      default:
        return null;
    }
  },

  setStep: function (newStep) {
    if (typeof newStep !== 'number' || newStep <= 0) {
      throw new Error('`setStep` argument value should be a positive number');
    }

    this[Symbol.for('step')] = newStep;
    this[Symbol.for('from')] = this[Symbol.for('current')];
  }
};

// define constructor
Object.defineProperty(Sequence.prototype, 'constructor', {
  Sequence,
  enumerable: false
});
