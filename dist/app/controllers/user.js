import { ErrorApi } from '../services/errorHandler.js';
import { User } from '../datamappers/index.js';
import { generateAccessToken, generateRefreshToken } from '../services/jsonWebToken.js';
import debug from 'debug';
const logger = debug('Controller');
const doSignIn = async (req, res) => {
    try {
        const { first_name } = req.body;
        const userExist = await User.findOne(first_name);
        if (!userExist)
            throw new ErrorApi(req, res, 401, `Informations not valid !`);
        const accessToken = generateAccessToken({ userExist });
        const refreshToken = generateRefreshToken({ userExist }, req);
        const userIdentity = { ...userExist, accessToken, refreshToken };
        return res.status(200).json(userIdentity);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
};
const fetchAllUsers = async (req, res) => {
    try {
        const { limit, start } = req.body;
        const users = await User.findAll(limit, start);
        return res.status(200).json(users);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
};
const fetchNearbyUsers = async (req, res) => {
    try {
        const userId = +req.params.userId;
        const { radius } = req.body;
        if (!radius)
            throw new ErrorApi(req, res, 401, `Add a radius if you want to find someone near by you!`);
        const users = await User.findAllNearbyUsers(userId, radius);
        return res.status(200).json(users);
    }
    catch (err) {
        if (err instanceof Error)
            logger(err.message);
    }
};
export { doSignIn, fetchAllUsers, fetchNearbyUsers };
//# sourceMappingURL=user.js.map