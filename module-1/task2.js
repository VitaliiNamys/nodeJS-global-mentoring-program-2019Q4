import csv from 'csvtojson';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';

const fileName = 'node_mentoring_t1_2_input_example';
const csvFilePath = path.join(__dirname, `csv/${fileName}.csv`);
const txtFileName = path.join(__dirname, `${fileName}.txt`);

const csvReadStream = fs.createReadStream(csvFilePath);
const txtWriteStream = fs.createWriteStream(txtFileName);

pipeline(
    csvReadStream,
    csv(),
    txtWriteStream,
    err => {
        if (err) {
            console.error('Pipeline failed\n', err);
        } else {
            console.log('Pipeline succeeded');
        }
    }
);
