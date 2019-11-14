const Benchmark = require('benchmark')

const suite = new Benchmark.Suite

suite
  .add('async/await', {
    defer: true,
    fn: deferred => {
      (async () => {
        await Promise.resolve(1)
        await Promise.resolve(2)
        deferred.resolve()
      })()
    }
  })
  .add('native promises', {
    defer: true,
    fn: deferred => {
      Promise.resolve(1)
        .then(() => Promise.resolve(2))
        .then(() => deferred.resolve())
    }
  })
  .on('cycle', event => {
    const r = event.target

    console.log(r.toString())
  })
  .on('complete', () => {
    console.dir('Fastest is ' + suite.filter('fastest').map('name'), {colors: true})
  })
  .run({
    'async': false
  })
