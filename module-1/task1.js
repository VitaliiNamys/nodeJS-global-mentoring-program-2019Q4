
process.stdin
    .on('data', chunk => {
        process.stdout.write(`${reverseString(chunk.toString())} \n`);
        process.stdout.write('------------------------------\n');
    });

const reverseString = str => str.split('').reverse().join('');
