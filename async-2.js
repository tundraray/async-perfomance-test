const Benchmark = require('benchmark')

const suite = new Benchmark.Suite

async function testawait() {
  let result =  await Promise.resolve(1);
  return result
} 

async function testpromise() {
  return Promise.resolve(1)
} 

function testpromise2() {
  return Promise.resolve(1)
} 


suite
  .add('with internal awaiter', {
    defer: true,
    fn: deferred => {
      (async () => {
        await testawait();
        deferred.resolve()
      })()
    }
  })
  .add('without await', {
    defer: true,
    fn: deferred => {
      (async () => {
        await testpromise();
        deferred.resolve()
      })()
    }
  })
  .add('as proxy', {
    defer: true,
    fn: deferred => {
      (async () => {
        await testpromise2();
        deferred.resolve()
      })()
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
