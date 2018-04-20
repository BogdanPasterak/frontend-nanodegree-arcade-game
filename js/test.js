
// TODO: A function that proves the effectiveness of 'OR' action over 'Math.floor'
/* In four tests, it tests the time of performing the loop with various actions
 * In the first test, the performance time of the loop itself is measured
 * In the second test, check the time of the assignment itself
 * The third test uses the Math library with the floor function
 * The last test uses the replacement for the previous function
 * [Bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)
 * The conversion to a binary form cuts the endpoint like 'Math.floor'
 * The advantage of this operation is speed
 * In my tests it is faster even than usual assignment !!
 */
const testOfSpeed = () => {
    const arrayRandom = new Array(10000000); // 10^8
    let tStart,
        tStop,
        zero;

    for(let i = 0; i < arrayRandom.length; i++) {
        arrayRandom[i] = Math.random()*1000;
    }
    console.log('velue = ' + arrayRandom[0] + '   after Math = ' + Math.floor(arrayRandom[0]) + '   after "or" = ' + (arrayRandom[0] | 0));

    // Test 1: the loop is empty
    tStart = performance.now();
    arrayRandom.forEach(function(element) {
        //zero = element;
    });
    tStop = performance.now();

    console.log('Time for loop = ' + Math.floor(tStop - tStart));

    // Test 2: normal assignment operation
    tStart = performance.now();
    arrayRandom.forEach(function(element) {
        zero = element;
    });
    tStop = performance.now();

    // Test 3: normal assignment operation
    console.log('Time for nothing = ' + Math.floor(tStop - tStart));

    tStart = performance.now();
    arrayRandom.forEach(function(element) {
        zero = Math.floor(element);
    });
    tStop = performance.now();

    console.log('Time for Math = ' + Math.floor(tStop - tStart));

    tStart = performance.now();
    arrayRandom.forEach(function(element) {
        zero = element | 0;
    });
    tStop = performance.now();

    console.log('Time for "or" = ' + Math.floor(tStop - tStart));

};