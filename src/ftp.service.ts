import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, FileInfo, FTPResponse, UploadOptions } from 'basic-ftp';
import { InjectionToken } from './application/injection.token';
import { Readable, Writable } from 'stream';
import { IFTPOptions } from './interface/options.interface';

@Injectable()
export class FtpService {
  private readonly _ftpClient: Client;
  private logger = new Logger('NestJs-Basic-FTP', { timestamp: true });
  constructor(
    @Inject(InjectionToken.FTP_CONFIG) private _options: IFTPOptions,
  ) {
    this.logger.log('Starting module', 'FtpService initialized');
    this._ftpClient = new Client();
    this._ftpClient.ftp.log = (message: string) => {
      if (this._options.verbose) {
        this.logger.debug(message);
      }
    };
  }

  /**
   * List files and directories in the current working directory, or at path if specified. Currently, this library only supports MLSD, Unix and DOS directory listings
   * @param path Path for listing
   * @returns
   */
  async list(path?: string): Promise<FileInfo[]> {
    try {
      await this.access();
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
      await this.access();
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
   * Download all files and directories of the current working directory to a given local directory. You can optionally set a specific remote directory. The working directory stays the same after calling this method.
   * @param localDirPath local file repository folder
   * @param remoteDirPath remote file download folder
   * @returns
   */
  async downloadToDir(
    localDirPath: string,
    remoteDirPath?: string,
  ): Promise<void> {
    try {
      await this.access();
      return await this._ftpClient.downloadToDir(localDirPath, remoteDirPath);
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
      await this.access();
      return await this._ftpClient.uploadFrom(source, toRemotePath, options);
    } finally {
      this._ftpClient.close();
    }
  }
  /**
   * Remove a file from the current working directory.
   * You can ignore FTP error return codes which won't throw an exception if e.g. the file doesn't exist.
   * @param path path to the deleted file
   * @param ignoreErrorCodes
   * @returns
   */
  async remove(path: string, ignoreErrorCodes?: boolean): Promise<FTPResponse> {
    try {
      await this.access();
      return await this._ftpClient.remove(path, ignoreErrorCodes);
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
      await this.access();
      return await this._ftpClient.size(path);
    } finally {
      this._ftpClient.close();
    }
  }
  /**
   * trackProgress Info
   * @param fileListing FileInfo[]
   * @returns
   */
  trackProgress(fileListing?: FileInfo[]): void {
    if (fileListing) {
      this._ftpClient.trackProgress((info) => {
        const currentFile = fileListing.find((file) => file.name === info.name);
        if (currentFile) {
          this.logger.debug(
            `${Math.floor((info.bytesOverall * 100) / currentFile.size)} % of ${
              info.name
            } file.`,
          );
        }
      });
    } else {
      this._ftpClient.trackProgress((info) => {
        this.logger.debug(info);
      });
    }
  }
  /**
   * This is an instance method and thus can be called multiple times during the lifecycle of a Client instance.
   */
  private async access() {
    await this._ftpClient.access(this._options);
    if (this._options.availableListCommands) {
      this._ftpClient.availableListCommands =
        this._options.availableListCommands;
    }
  }
}
