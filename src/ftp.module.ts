import { DynamicModule, Module } from '@nestjs/common';
import { InjectionToken } from './application/injection.token';
import { FtpService } from './ftp.service';
import { IFTPConfig } from './interface/config.interface';

@Module({})
export class FtpModule {
  static forRootFtpAsync(options: IFTPConfig): DynamicModule {
    return {
      module: FtpModule,
      imports: options.imports || [],
      providers: [
        {
          provide: InjectionToken.FTP_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        FtpService,
      ],
      exports: [FtpService],
    };
  }
}
