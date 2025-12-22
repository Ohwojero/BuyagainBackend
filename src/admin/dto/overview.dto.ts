import { ApiProperty } from '@nestjs/swagger';

export class OverviewDto {
  @ApiProperty()
  totalMerchants: number;

  @ApiProperty()
  activeMerchants: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalRedemptions: number;

  @ApiProperty()
  totalCodesGenerated: number;

  @ApiProperty({ type: [Object] })
  recentMerchants: any[];

  @ApiProperty({ type: [Object] })
  planDistribution: any[];
}
