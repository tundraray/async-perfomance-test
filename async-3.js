const Benchmark = require('benchmark')

const suite = new Benchmark.Suite

function timeoutPromise(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      resolve("done");
    }, interval);
  });
};
const timeout = 1

async function slowAsync() {
  await timeoutPromise(timeout);
  await timeoutPromise(timeout);
  await timeoutPromise(timeout);
}

async function fastAsync() {
  const timeoutPromise1 = timeoutPromise(timeout);
  const timeoutPromise2 = timeoutPromise(timeout);
  const timeoutPromise3 = timeoutPromise(timeout);
  await timeoutPromise1;
  await timeoutPromise2;
  await timeoutPromise3;
}

suite
  .add('slow async method', {
    defer: true,
    fn: deferred => {
      (async () => {
        await slowAsync();
        deferred.resolve()
      })()
    }
  })
  .add('fast async method', {
    defer: true,
    fn: deferred => {
      (async () => {
        await fastAsync();
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
