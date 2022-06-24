<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="NestJS Logo" />
  </a>
</div>

<h3 align="center">NestJs-Basic-Ftp </h3>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="License" />
<img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
</div>

### Installation
##### Installation 
> npm install nestjs-basic-ftp

### About nestjs-basic-ftp

Originally forked but recast from https://github.com/AbdessalemLetaief/nestjs-ftp package

And extend the library https://github.com/patrickjuchli/basic-ftp

This is an FTP client for NestJs, it supports FTPS over TLS, Passive Mode over IPv6, has a Promise-based API, and offers methods to operate on whole directories built on top of basic-ftp.

### Inject module in your nestJs project

Nestjs-basic-ftp is build using the NestJs Dynamic modules and Factory providers approach, to configure it import the `FtpModule` module and the `forRootFtpAsync` service.

For example, your `AppModule` should look like this :

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FtpModule } from 'nestjs-basic-ftp';

@Module({
  imports: [
    ConfigModule,
    FtpModule.forRootFtpAsync({
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('FTP_URL'),
          port: config.get<number>('FTP_PORT'),
          user: config.get<string>('FTP_USER'),
          password: config.get<string>('FTP_PASS'),
          secure: config.get<boolean>('FTP_SECURE'),
          verbose: true, // example, may not be declared
          availableListCommands: ['LIST -a', 'LIST'], // example, may not be declared
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
```
Then just inject the service just like any local service

For Example:

```typescript
import { Injectable, ServiceUnavailableException, Logger } from '@nestjs/common';
import { FtpService } from 'nestjs-basic-ftp';

@Injectable()
export class AppService {
    private logger = new Logger('AppService', { timestamp: true });
    constructor(private readonly _ftpService: FtpService){}

    public async listingFile(): Promise<FileInfo[]> {
    try {
      const fileList = await this._ftpService.list();
      return fileList;
    } catch (e) {
      this.logger.error(JSON.stringify(e));
      throw new ServiceUnavailableException(e);
    }
  }
}

```

### License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
