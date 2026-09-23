import { describe, it, expect, beforeEach } from 'vitest';
import type { Request } from 'express';
import {
  getClientIp,
  getSocketIp,
  isTrustedProxyPeer,
  resetProxyIpConfig,
  setProxyIpConfig,
  DEFAULT_TRUSTED_PROXIES,
} from '../../src/utils/client-ip';

function mockReq(opts: {
  remoteAddress?: string;
  headers?: Record<string, string>;
  ip?: string;
}): Request {
  return {
    socket: { remoteAddress: opts.remoteAddress || '203.0.113.50' },
    headers: opts.headers || {},
    ip: opts.ip,
  } as unknown as Request;
}

describe('client-ip security', () => {
  beforeEach(() => {
    resetProxyIpConfig();
    setProxyIpConfig({
      trustHops: 1,
      source: 'auto',
      trustedProxies: [...DEFAULT_TRUSTED_PROXIES],
    });
  });

  it('ignores CF-Connecting-IP from untrusted peer (spoof protection)', () => {
    const req = mockReq({
      remoteAddress: '203.0.113.50',
      headers: { 'cf-connecting-ip': '8.8.8.8' },
    });
    expect(getClientIp(req)).toBe('203.0.113.50');
  });

  it('ignores X-Real-IP from untrusted peer', () => {
    const req = mockReq({
      remoteAddress: '198.51.100.10',
      headers: { 'x-real-ip': '1.1.1.1' },
    });
    expect(getClientIp(req)).toBe('198.51.100.10');
  });

  it('ignores X-Forwarded-For leftmost from untrusted peer', () => {
    const req = mockReq({
      remoteAddress: '198.51.100.10',
      headers: { 'x-forwarded-for': '9.9.9.9, 198.51.100.10' },
      ip: '9.9.9.9',
    });
    // peer not trusted → socket only, even if Express set req.ip
    expect(getClientIp(req)).toBe('198.51.100.10');
  });

  it('ignores client-injected CF-Connecting-IP behind nginx (no CF-Ray)', () => {
    const req = mockReq({
      remoteAddress: '127.0.0.1',
      headers: {
        'cf-connecting-ip': '8.8.8.8',
        'x-real-ip': '203.0.113.20',
      },
    });
    expect(getClientIp(req)).toBe('203.0.113.20');
  });

  it('trusts CF-Connecting-IP from loopback only when CF-Ray is present', () => {
    const req = mockReq({
      remoteAddress: '127.0.0.1',
      headers: {
        'cf-connecting-ip': '8.8.8.8',
        'cf-ray': 'abc123-SJC',
      },
    });
    expect(getClientIp(req)).toBe('8.8.8.8');
  });

  it('trusts X-Real-IP from configured trusted proxy CIDR', () => {
    setProxyIpConfig({
      trustHops: 1,
      source: 'nginx',
      trustedProxies: ['10.0.0.0/8', '127.0.0.1'],
    });
    const req = mockReq({
      remoteAddress: '10.1.2.3',
      headers: { 'x-real-ip': '203.0.113.99' },
    });
    expect(getClientIp(req)).toBe('203.0.113.99');
  });

  it('socket source always uses peer', () => {
    setProxyIpConfig({ source: 'socket', trustHops: 1 });
    const req = mockReq({
      remoteAddress: '127.0.0.1',
      headers: { 'cf-connecting-ip': '8.8.8.8' },
    });
    expect(getClientIp(req)).toBe('127.0.0.1');
  });

  it('trustHops 0 disables headers', () => {
    setProxyIpConfig({ trustHops: 0, source: 'auto' });
    const req = mockReq({
      remoteAddress: '127.0.0.1',
      headers: { 'cf-connecting-ip': '8.8.8.8' },
    });
    expect(getClientIp(req)).toBe('127.0.0.1');
  });

  it('isTrustedProxyPeer loopback', () => {
    expect(isTrustedProxyPeer('127.0.0.1')).toBe(true);
    expect(isTrustedProxyPeer('203.0.113.1')).toBe(false);
  });

  it('getSocketIp never uses headers', () => {
    const req = mockReq({
      remoteAddress: '203.0.113.1',
      headers: { 'cf-connecting-ip': '1.2.3.4' },
    });
    expect(getSocketIp(req)).toBe('203.0.113.1');
  });
});
