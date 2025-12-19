import { PartialType } from '@nestjs/mapped-types';
import { CreateTeammemberDto } from './create-teammember.dto';

export class UpdateTeammemberDto extends PartialType(CreateTeammemberDto) {}
