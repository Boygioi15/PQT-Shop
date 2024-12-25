import userModel from '../models/user.model.js';
import {
    AuthFailureError,
    BadRequestError,
    ErrorResponse
} from '../core/error.response.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import {
    emailRemindChangePassWord,
    emailSendToken
} from './email.service.js';
import {
    checkEmailToken
} from './otp.service.js';
import {
    createUserRepo,
    findByEmail
} from '../models/repositories/user.repository.js';
import {
    getInfoData,
    getUsernameFromEmail
} from '../utils/index.js';
import {
    createTokenPair
} from '../auth/authUtils.js';
import KeyTokenService from './keyToken.service.js';

const isValid = () = {

}
const newUserService = async ({
    email = null
}) => {
    const user = await userModel.findOne({
        usr_email: email,
        googleId: null
    }).lean();

    if (user) throw new ErrorResponse('Email already exists');

    const res = await emailSendToken({
        email
    });

    return {
        message: 'success',
        metadata: {
            token: res,
        },
    };
};

const checkLoginEmailTokenService = async ({
    token,
    res
}) => {
    const {
        otp_email: email,
        otp_token
    } = await checkEmailToken({
        token
    });
    if (!email) throw new BadRequestError('Token not found');

    const existingUser = await findByEmail({
        email
    });
    if (existingUser) throw new BadRequestError('Email already exists');

    const passwordHash = await bcrypt.hash(getUsernameFromEmail(email), 10);

    const newUser = await createUserRepo({
        usr_name: getUsernameFromEmail(email),
        usr_email: email,
        usr_password: passwordHash,
        usr_role: '6704099fb8583f3dc7342d12',
    });

    if (newUser) {
        const {
            publicKey,
            privateKey
        } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });

        const tokens = await createTokenPair({
                userId: newUser._id,
                email
            },
            publicKey,
            privateKey
        );

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        });

        await KeyTokenService.upsertKeyToken({
            userId: newUser._id,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        await emailRemindChangePassWord({
            receicedEmail: email,
            usr_name: newUser.usr_name,
        });

        setTimeout(
            () => deleteUserIfNotChangedPassword(newUser._id).catch(console.error),
            2 * 60 * 60 * 1000
        );

        return res.redirect(`http://localhost:5173/?user=${newUser._id}&token=${tokens.accessToken}`);
    }
};

const deleteUserIfNotChangedPassword = async (userId) => {
    const user = await userModel.findById(userId);

    if (user) {
        const expiryTime = new Date(user.createdAt.getTime() + 2 * 60 * 60 * 1000);
        const now = new Date();

        if (now >= expiryTime && !user.passwordChangedAt) {
            await userModel.findByIdAndDelete(userId);
            console.log(`User with ID ${userId} has been deleted for not changing password.`);
        }
    }
};

const changePassWordService = async ({
    email,
    currentPassword,
    newPassword,
    reNewPassword
}) => {
    const foundUser = await findByEmail({
        email
    });
    if (!foundUser) throw new BadRequestError('User is not registered');

    const match = await bcrypt.compare(currentPassword, foundUser.usr_password);
    if (!match) throw new AuthFailureError('Authentication error');

    if (newPassword !== reNewPassword) throw new BadRequestError('Passwords do not match');

    const passwordHash = await bcrypt.hash(newPassword, 10);

    return await userModel.updateOne({
        usr_email: email
    }, {
        usr_password: passwordHash,
        usr_isDefaultPassword: false,
    });
};

const findOrCreateUser = async ({
    googleId,
    email,
    name,
    img
}) => {
    try {
        const user = await userModel.findOne({
            googleId
        });

        if (user) {
            return user;
        }

        const newUser = await userModel.create({
            googleId,
            usr_email: email,
            usr_name: name,
            usr_avatar: img,
            usr_password: 'none',
            usr_role: '6704099fb8583f3dc7342d12',
        });

        return newUser;
    } catch (err) {
        console.error('Error in findOrCreateUser:', err);
        throw err;
    }
};
// Thay đổi quyền của người dùng
const changeUserRoleService = async ({
    userId,
    newRole
}) => {
    const user = await userModel.findById(userId);
    if (!user) throw new BadRequestError('User not found');

    user.usr_role = newRole;
    await user.save();

    return {
        message: `User role updated successfully to ${newRole}`,
        user: {
            id: user._id,
            email: user.usr_email,
            role: user.usr_role,
        },
    };
};

// Lấy danh sách người dùng đang hoạt động (active)
const getActiveUsersService = async () => {
    const activeUsers = await userModel.find({
        usr_isBlocked: false
    }).lean();
    return activeUsers;
};

// Lấy danh sách người dùng bị khóa (blocked)
const getBlockedUsersService = async () => {
    const blockedUsers = await userModel.find({
        usr_isBlocked: true
    }).lean();
    return blockedUsers;
};
export {
    newUserService,
    checkLoginEmailTokenService,
    changePassWordService,
    findOrCreateUser,
    changeUserRoleService,
    getActiveUsersService,
    getBlockedUsersService,
};