process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    let chunk;

    while ((chunk = process.stdin.read()) !== null) {
        process.stdout.write(`${reverseString(chunk)} \n`);
        process.stdout.write('------------------------------\n');
    }
});

const reverseString = (str) => str.split('').reverse().join('');
