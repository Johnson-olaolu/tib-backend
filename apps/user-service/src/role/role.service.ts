import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from '../../../../libs/shared/src/dto/user-service/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const newRole = await this.roleRepository.save(createRoleDto);
    return newRole;
  }

  async findAll() {
    const roles = await this.roleRepository.find();
    return roles;
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOneBy({
      id: id,
    });
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  async findOneByName(name: string) {
    const role = await this.roleRepository.findOneBy({
      name: name,
    });
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    for (const item in updateRoleDto) {
      role[item] = updateRoleDto[item];
    }
    await role.save();
    return role;
  }

  async remove(id: number) {
    const deleteResponse = await this.roleRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Role not found for this ID');
    }
  }
}
