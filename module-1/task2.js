const csv = require('csvtojson');
const path = require('path');
const fs = require('fs');

const fileName = 'node_mentoring_t1_2_input_example';
const csvFilePath = path.join(__dirname, `csv/${fileName}.csv`);
const txtFileName = `${fileName}.txt`;

(async function () {
    try {
        const csvData = await getDataFromCSV();

        fs.writeFile(txtFileName, csvData, err => { if (err) { throw err; } });
    } catch (err) {
        console.error(err);
    }
}());

async function getDataFromCSV() {
    let processedData = '';

    await csv()
        .fromFile(csvFilePath)
        .preFileLine((fileLine, lineIdx) => {
            if (lineIdx === 0) { return; }
            processedData += `${processCSVLine(fileLine)}\n`;

            return fileLine;
        });

    return processedData;
}

function processCSVLine(csvFileLine) {
    const [book, author, , price] = csvFileLine.split(',');

    return JSON.stringify({ book, author, price });
}
