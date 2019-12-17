import * as dotenv from 'dotenv';

const path = `${__dirname}/../../.env`;

dotenv.config({ path });

export default {
    PORT: process.env.PORT
};
