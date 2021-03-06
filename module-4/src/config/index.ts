import dotenv from 'dotenv';

const path = `${__dirname}/../../.env`;

dotenv.config({ path });

export default {
    PORT: process.env.PORT,
    ENV: process.env.NODE_ENV || 'development',
    db: {
        DBUrl: process.env.DB_URL
    }
};
