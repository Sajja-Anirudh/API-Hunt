import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

@Injectable()
export class AppService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async startScanSequence(targetUrl: string, authToken: string, clientId: string) {
    try {
      console.log('[*] Step 1: Creating database records in Supabase...');
      
      const { data: targetData, error: targetErr } = await this.supabase
        .from('targets')
        .insert([{ client_id: clientId, base_url: targetUrl, auth_token: authToken }])
        .select().single();

      if (targetErr) throw new Error(`Supabase Target Error: ${targetErr.message}`);

      const { data: scanData, error: scanErr } = await this.supabase
        .from('scans')
        .insert([{ target_id: targetData.id, status: 'running' }])
        .select().single();

      if (scanErr) throw new Error(`Supabase Scan Error: ${scanErr.message}`);

      const scanId = scanData.id;
      console.log(`[*] Step 2: Database records created! Scan ID: ${scanId}`);

      const pythonScriptPath = path.resolve(__dirname, '../../scanner-engine/scanner.py');
      
      // Point EXACTLY to the virtual environment's Python to prevent module errors
      const pythonExecutable = path.resolve(__dirname, '../../scanner-engine/venv/Scripts/python.exe');
      
      console.log(`[*] Step 3: Spawning Python using VENV: ${pythonExecutable}`);
      
      // Use '-u' to prevent Python from buffering standard output
      const pythonProcess = spawn(pythonExecutable, ['-u', pythonScriptPath, '--target_url', targetUrl], { 
        env: { ...process.env } 
      });

      // Catch Python syntax/module crashes instantly
      pythonProcess.stderr.on('data', (data) => {
        console.error(`\n[PYTHON FATAL CRASH]: ${data.toString()}`);
      });

      // Catch NodeJS spawn failures instantly
      pythonProcess.on('error', (err) => {
        console.error('\n[!!!] NODEJS FAILED TO START PYTHON:', err);
      });

      pythonProcess.stdout.on('data', async (data) => {
        const output = data.toString().trim();
        if (!output) return;

        console.log(`[Python]: ${output}`);

        const lines = output.split('\n');
        
        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;

          let colorType = 'info'; 
          if (cleanLine.includes('[!!!]') || cleanLine.includes('[X]')) colorType = 'red';
          if (cleanLine.includes('[+]')) colorType = 'green';

          await this.supabase.from('scan_logs').insert([{
            scan_id: scanId,
            http_method: 'SYS', 
            endpoint_path: 'STDOUT',
            response_body_snippet: { message: cleanLine, type: colorType }
          }]);
        }
      });

      pythonProcess.on('close', async (code) => {
        console.log(`[*] Step 4: Python process closed with code ${code}`);
        await this.supabase.from('scans').update({ 
            status: code === 0 ? 'completed' : 'failed', 
            completed_at: new Date().toISOString() 
        }).eq('id', scanId);
      });

      return { scanId: scanId };

    } catch (error) {
      console.error('\n[!!!] CAUGHT ERROR IN NESTJS:', error);
      throw new InternalServerErrorException('Failed to initialize attack sequence');
    }
  }
}