import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  // Lấy tất cả người dùng
  async findAll() {
    return this.userModel.find().exec();
  }

  // Tìm người dùng theo ID
  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Cập nhật thông tin người dùng theo ID
  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Xóa người dùng theo ID
  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  // Tìm người dùng theo số điện thoại hoặc email
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [
          { phone: username },
          { email: username },
          { accountName: username },
        ],
      })
      .exec();
  }

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async register(registerUserDto: RegisterUserDto) {
    if (registerUserDto.password !== registerUserDto.reEnterPassword) {
      return new BadRequestException('Mật khẩu không khớp');
    }
    const hashPassword = this.getHashPassword(registerUserDto.password);
    if (registerUserDto.email) {
      const isExistEmail = await this.userModel.findOne({
        email: registerUserDto?.email,
      });

      if (isExistEmail) {
        throw new BadRequestException(
          `Email: ${registerUserDto?.email} đã tồn tại`,
        );
      }
    } else {
      const isExistPhone = await this.userModel.findOne({
        phone: registerUserDto?.phone,
      });
      if (isExistPhone) {
        throw new BadRequestException(
          `Phone: ${registerUserDto?.phone} đã tồn tại`,
        );
      }
    }
    const newUser = await this.userModel.create({
      email: registerUserDto.email,
      phone: registerUserDto.phone,
      password: hashPassword,
    });

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    };
  }

  async findOrCreate(userData: {
    email: string;
    name: string;
    googleId?: string;
    facebookId?: string;
  }): Promise<UserDocument> {
    let user;

    if (userData.googleId) {
      user = await this.userModel.findOne({ googleId: userData.googleId });
    } else if (userData.facebookId) {
      user = await this.userModel.findOne({
        facebookId: userData.facebookId,
      });
    }

    if (!user) {
      user = await this.userModel.create({
        name: userData.name,
        email: userData.email,
        googleId: userData.googleId,
        facebookId: userData.facebookId,
      });
    }

    return user;
  }
}
