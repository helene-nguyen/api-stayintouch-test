import 'dotenv/config';
import express from 'express';
const app = express();
import { router } from './app/routes/index.js';
import { ErrorApi } from './app/services/errorHandler.js';
import helmet from 'helmet';
app.use(helmet());
import debug from 'debug';
const logger = debug('Entrypoint');
app.use(express.json());
app.use(express.urlencoded({
    extended: false,
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
import session from 'express-session';
app.use(session({
    saveUninitialized: false,
    resave: true,
    proxy: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 60 * 60 * 1000),
    },
}));
app.use(router);
app.use((req, res) => {
    throw new ErrorApi(req, res, 404, `Page not found !`);
});
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    logger(`🚀\x1b[1;35m Launch server on http://localhost:${PORT}\x1b[0m`);
});
//# sourceMappingURL=index.js.map