import debug from 'debug';
const logger = debug('Controller');
const renderHomePage = (req, res) => {
    try {
        return res.status(200).json({
            message: 'Welcome to API StayInTouch',
        });
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
};
export { renderHomePage };
//# sourceMappingURL=main.js.map