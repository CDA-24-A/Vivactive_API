import { Injectable } from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CitizenService {
  constructor(private prisma: PrismaService) {}
  create(createCitizenDto: CreateCitizenDto) {
    return this.prisma.citizen.create({ data: createCitizenDto });
  }

  findAll() {
    return this.prisma.citizen.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        password: true,
        role: {
          select: { name: true },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} citizen`;
  }

  update(id: number, updateCitizenDto: UpdateCitizenDto) {
    return `This action updates a #${id} citizen`;
  }

  remove(id: number) {
    return `This action removes a #${id} citizen`;
  }
}
