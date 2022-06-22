import { ModuleMetadata } from '@nestjs/common/interfaces';
import { IFTPOptions } from './options.interface';

export interface IFTPConfig extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<IFTPOptions> | IFTPOptions;
  inject?: any[];
}
