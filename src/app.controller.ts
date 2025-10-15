import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller('')
export class AppController {
  @Get('')
  @ApiOperation({
    summary: 'Base url',
    description: 'TEST',
  })
  base(): string {
    return 'Hi. This is TEST API';
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Health check endpoint for Digital Ocean',
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
