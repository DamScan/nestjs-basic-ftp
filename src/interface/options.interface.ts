import { ConnectionOptions as TLSConnectionOptions } from 'tls';

export interface IFTPOptions {
  /** Server host, default: localhost */
  readonly host?: string;
  /** Server port, default: 21 */
  readonly port?: number;
  /** Username, default: anonymous */
  readonly user?: string;
  /** Password, default: guest */
  readonly password?: string;
  /** Explicit FTPS over TLS, default: false. Use "implicit" if you need support for legacy implicit FTPS. */
  readonly secure?: boolean | 'implicit';
  /** Options for TLS, same as for tls.connect() in Node.js. */
  readonly secureOptions?: TLSConnectionOptions;
  /** Log verbose. Optional, default is false */
  readonly verbose?: boolean;
  /** Configure it with a timeout in milliseconds that will be used for any connection made. Use 0 to disable timeouts, default is 30 seconds. */
  //readonly timeout?: number;
}
