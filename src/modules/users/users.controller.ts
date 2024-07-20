import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto, UserRole } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { PaginateQuery } from 'nestjs-paginate';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationQueries } from '@/decorators/pagination.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.NURSE)
  @ApiQuery({
    name: 'role',
    required: false,
    type: 'string',
  })
  @PaginationQueries()
  @Get()
  async findAll(@Query() query: PaginateQuery, @Query('role') role: UserRole) {
    return this.usersService.findAll(query, role);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPERVISOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':nurseId/assign/:patientId')
  @Roles(UserRole.SUPERVISOR)
  async assignPatientToNurse(
    @Param('patientId') patientId: string,
    @Param('nurseId') nurseId: string,
  ) {
    await this.usersService.assignPatientToNurse(patientId, nurseId);
    return { message: 'Patient assigned to nurse successfully' };
  }
}
