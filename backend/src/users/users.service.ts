import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  // Lấy tất cả người dùng
  async findAll() {
    return this.userModel.find().exec();
  }

  // Tìm người dùng theo ID
  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
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
        $or: [{ phone: username }, { email: username }],
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
    const hashPassword = this.getHashPassword(registerUserDto.password);
    const isExistEmail = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (isExistEmail) {
      throw new BadRequestException(
        `Email: ${registerUserDto.email} đã tồn tại`,
      );
    }
    const data = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
    });

    return {
      _id: data._id,
    };
  }
  async create(createUserDto: CreateUserDto, user: any) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const isExistEmail = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExistEmail) {
      throw new BadRequestException(`Email: ${createUserDto.email} đã tồn tại`);
    }
    let data = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });

    return {
      _id: data._id,
    };
  }
}
