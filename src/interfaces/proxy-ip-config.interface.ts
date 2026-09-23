import type { ProxyIpSource } from './proxy-ip-source.type';

export interface ProxyIpConfig {
  /** Express trust proxy hops; 0 = do not trust any proxy headers */
  trustHops: number;
  source: ProxyIpSource;
  /**
   * CIDR/IP of reverse proxies allowed to set client-IP headers.
   * Default loopback only — add e.g. 10.0.0.0/8 if nginx is on another host.
   */
  trustedProxies: string[];
}
