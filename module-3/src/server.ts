import App from './app';
import config from './config';

const PORT = config.PORT || 3000;

App.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}!`),
);
