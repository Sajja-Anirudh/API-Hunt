import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/scan')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('start')
  async startScan(
    @Body() body: { targetUrl: string; tiers?: string[]; totalBilled?: number; authToken?: string; clientId?: string }
  ) {
    console.log('\n[!!!] NESTJS RECEIVED THE ATTACK COMMAND:', body);
    
    return this.appService.startScanSequence(
      body.targetUrl,
      body.authToken || '',
      body.clientId || 'enterprise-client'
    );
  }

  // --- NEW: SERVE REPORT DATA TO REACT ---
  @Get('report/:scanId')
  async getReport(@Param('scanId') scanId: string) {
    return this.appService.getReportData(scanId);
  }
}