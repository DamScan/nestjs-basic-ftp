import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, FileInfo, FTPResponse, UploadOptions } from 'basic-ftp';
import { InjectionToken } from './application/injection.token';
import { Readable, Writable } from 'stream';
import { IFTPOptions } from './interface/options.interface';

@Injectable()
export class FtpService {
  private readonly _ftpClient: Client;
  private logger = new Logger('NEST-BASIC-FTP', { timestamp: true });
  constructor(
    @Inject(InjectionToken.FTP_CONFIG) private _options: IFTPOptions,
  ) {
    this.logger.log('Starting module', 'FTP SERVICE');
    this._ftpClient = new Client();
    this._ftpClient.ftp.verbose = this._options.verbose;
    this._ftpClient.ftp.log = this.logger.debug;
  }

  /**
   * List files and directories in the current working directory, or at path if specified. Currently, this library only supports MLSD, Unix and DOS directory listings
   * @param path Path for listing
   * @returns
   */
  async list(path?: string): Promise<FileInfo[]> {
    try {
      await this._ftpClient.access(this._options);
      return await this._ftpClient.list(path);
    } catch (err) {
      this._ftpClient.close();
      throw err;
    } finally {
      this._ftpClient.close();
    }
  }

  /**
   * Download a remote file and pipe its data to a writable stream or to a local file. You can optionally define at which position of the remote file you'd like to start downloading. If the destination you provide is a file, the offset will be applied to it as well. For example: To resume a failed download, you'd request the size of the local, partially downloaded file and use that as the offset.
   * @param destination Destination to save file to
   * @param fromRemotePath remote path in Ftp
   * @param startAt
   * @returns
   */
  async downloadTo(
    destination: Writable | string,
    fromRemotePath: string,
    startAt?: number,
  ): Promise<FTPResponse> {
    try {
      await this._ftpClient.access(this._options);
      return await this._ftpClient.downloadTo(
        destination,
        fromRemotePath,
        startAt,
      );
    } finally {
      this._ftpClient.close();
    }
  }

  /**
   * Upload data from a readable stream or a local file to a remote file. If such a file already exists it will be overwritten.
   * @param source path to the file to upload or a readable file
   * @param toRemotePath path to save your file
   * @param options
   * @returns
   */
  async uploadFrom(
    source: Readable | string,
    toRemotePath: string,
    options?: UploadOptions,
  ): Promise<FTPResponse> {
    try {
      await this._ftpClient.access(this._options);
      return await this._ftpClient.uploadFrom(source, toRemotePath, options);
    } finally {
      this._ftpClient.close();
    }
  }
  /**
   * Remove a file.
   * @param path path to the deleted file
   * @returns
   */
  async remove(path: string): Promise<FTPResponse> {
    try {
      await this._ftpClient.access(this._options);
      return await this._ftpClient.remove(path);
    } finally {
      this._ftpClient.close();
    }
  }
  /**
   * Get the size of a file in bytes.
   * @param path
   * @returns
   */
  async size(path: string): Promise<number> {
    try {
      await this._ftpClient.access(this._options);
      return await this._ftpClient.size(path);
    } finally {
      this._ftpClient.close();
    }
  }
  /**
   * trackProgress Info
   * @params
   * @returns
   */
  trackProgress(): void {
    this._ftpClient.trackProgress((info) => console.log(info.bytesOverall));
  }
}
