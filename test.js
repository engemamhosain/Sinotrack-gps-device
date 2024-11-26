function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    console.log(3)
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  console.log(1)
  var x = await resolveAfter2Seconds(10);
  console.log(2)
  console.log(x); // 10
}

f1();