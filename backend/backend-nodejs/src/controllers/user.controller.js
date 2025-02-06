import {
    SuccessResponse
} from '../core/success.response.js';
import userModel from '../models/user.model.js';

import {
    addNewAddress,
    changePassWordService,
    changeUserRole,
    changeUserStatus,
    checkLoginEmailTokenService,
    getDefaultAddress,
    getListAddress,
    getListUser,
    getUserStats,
    updateProfileService,
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

    getListUser = async (req, res, next) => {};

    deleteUser = async (req, res, next) => {};

    changePassword = async (req, res, next) => {
        return new SuccessResponse({
            message: 'create new user',
            metadata: await changePassWordService({
                ...req.body,
            }),
        }).send(res);
    };

    addNewUserAddress = async (req, res, next) => {
        return new SuccessResponse({
            message: 'add new user address',
            metadata: await addNewAddress({
                ...req.body,
            }),
        }).send(res);
    };

    getUserAddress = async (req, res, next) => {
        return new SuccessResponse({
            message: 'add new user address',
            metadata: await getListAddress({
                ...req.params
            }),
        }).send(res);
    };

    getUserDefaultAddress = async (req, res, next) => {
        return new SuccessResponse({
            message: 'add new user address',
            metadata: await getDefaultAddress({
                ...req.params
            }),
        }).send(res);
    };

    getListUserForAddmin = async (req, res, next) => {
        return new SuccessResponse({
            message: 'add new user address',
            metadata: await getListUser({
                ...req.query
            }),
        }).send(res);
    };

    changeUserStatus = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Change status',
            metadata: await changeUserStatus({
                ...req.body
            }),
        }).send(res);
    };

    updateUserProfile = async (req, res, next) => {
        try {
            const {
                userId
            } = req.user; // ID của người dùng từ route
            console.log("🚀 ~ UserController ~ updateUserProfile= ~ req.user:", req.user)
            const {
                usr_name,
                usr_phone,
                usr_email,
                usr_img,
                usr_sex,
                usr_date_of_birth
            } = req.body;

            // Gọi service để thực hiện cập nhật
            const updatedUser = await updateProfileService({
                id: userId,
                usr_name,
                usr_phone,
                usr_email,
                usr_img,
                usr_sex,
                usr_date_of_birth
            });

            // Trả về kết quả sau khi cập nhật
            return new SuccessResponse({
                message: "Profile updated successfully",
                metadata: updatedUser,
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

    changeUserRole = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Change status',
            metadata: await changeUserRole({
                ...req.body
            }),
        }).send(res);
    };

    getUserStats = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Change status',
            metadata: await getUserStats(),
        }).send(res);
    };


    getUserRole = async (req, res) => {
        try {
            const userId = req.user.userId;

            const user = await userModel.findById(userId)
                .populate({
                    path: 'usr_role',
                    populate: {
                        path: 'rol_grants.resource'
                    }
                });

            if (!user || !user.usr_role) {
                return res.status(404).json({
                    message: 'Role not found'
                });
            }

            return new SuccessResponse({
                message: 'Change status',
                metadata: user.usr_role,
            }).send(res);

        } catch (error) {
            console.error('Error fetching user role:', error);
            res.status(500).json({
                message: 'Error fetching user role'
            });
        }
    };

    updateAddress = async (req, res, next) => {
        const {
            userId
        } = req.user
        return new SuccessResponse({
            message: 'update user address',
            metadata: await updateAddress({
                userId,
                ...req.params,
                updatedAddress: {
                    ...req.body
                }
            }),
        }).send(res);
    };
    deleteAddress = async (req, res, next) => {
        const {
            userId
        } = req.user
        return new SuccessResponse({
            message: 'add new user address',
            metadata: await deleteAddress({
                userId,
                ...req.params,
            }),
        }).send(res);
    };
    updateDefaultAddress = async (req, res, next) => {
        const {
            userId
        } = req.user
        return new SuccessResponse({
            message: 'add new user address',
            metadata: await updateDefaultAddress({
                userId,
                ...req.params,
            }),
        }).send(res);
    };
}
export default new UserController();