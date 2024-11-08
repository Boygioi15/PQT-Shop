import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Tạo mới một người dùng
  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

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
}
