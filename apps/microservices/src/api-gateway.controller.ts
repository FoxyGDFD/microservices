import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }
}
