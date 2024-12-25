import {
    SuccessResponse
} from '../core/success.response.js';

import {
    changePassWordService,
    checkLoginEmailTokenService,
    createUserService,
    updateUserService,
    deleteUserService,
} from '../services/user.service.js';

class UserController {
    checkLoginEmailToken = async (req, res, next) => {
        const respond = await checkLoginEmailTokenService({
            token: req.query.token,
            res,
        });
        // return new SuccessResponse({
        //     message: 'create new user',
        //     metadata: respond,
        // }).send(res);
    };

    // Thêm user mới
    createUser = async (req, res, next) => {
        try {
            const newUser = await createUserService(req.body);
            return new SuccessResponse({
                message: 'User created successfully',
                metadata: newUser,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    // Sửa thông tin user
    updateUser = async (req, res, next) => {
        try {
            const updatedUser = await updateUserService({
                userId: req.params.id,
                ...req.body,
            });
            return new SuccessResponse({
                message: 'User updated successfully',
                metadata: updatedUser,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    // Xóa user
    deleteUser = async (req, res, next) => {
        try {
            const result = await deleteUserService({
                userId: req.params.id
            });
            return new SuccessResponse({
                message: 'User deleted successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Password changed successfully',
            metadata: await changePassWordService({
                email: req.user.email,
                ...req.body,
            }),
        }).send(res);
    };

    changeUserRole = async (req, res, next) => {
        try {
            const {
                userId,
                newRole
            } = req.body;
            const result = await changeUserRoleService({
                userId,
                newRole
            });
            return new SuccessResponse({
                message: 'User role changed successfully',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    // Lấy danh sách người dùng đang hoạt động
    getActiveUsers = async (req, res, next) => {
        try {
            const activeUsers = await getActiveUsersService();
            return new SuccessResponse({
                message: 'List of active users',
                metadata: activeUsers,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    // Lấy danh sách người dùng bị khóa
    getBlockedUsers = async (req, res, next) => {
        try {
            const blockedUsers = await getBlockedUsersService();
            return new SuccessResponse({
                message: 'List of blocked users',
                metadata: blockedUsers,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();