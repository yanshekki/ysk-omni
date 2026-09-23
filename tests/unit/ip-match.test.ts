import { describe, expect, it } from 'vitest';
import {
  ipAllowed,
  isValidIpOrCidr,
  normalizeIp,
  parseIpList,
} from '../../src/utils/ip-match';

describe('ip-match', () => {
  it('normalizes IPv4-mapped IPv6 and loopback', () => {
    expect(normalizeIp('::ffff:127.0.0.1')).toBe('127.0.0.1');
    expect(normalizeIp('::1')).toBe('127.0.0.1');
  });

  it('matches loopback whitelist variants', () => {
    expect(ipAllowed('::1', ['127.0.0.1'])).toBe(true);
    expect(ipAllowed('127.0.0.1', ['::1'])).toBe(true);
  });

  it('validates IP and CIDR', () => {
    expect(isValidIpOrCidr('10.0.0.1')).toBe(true);
    expect(isValidIpOrCidr('10.0.0.0/24')).toBe(true);
    expect(isValidIpOrCidr('not-an-ip')).toBe(false);
  });

  it('empty whitelist allows all', () => {
    expect(ipAllowed('1.2.3.4', [])).toBe(true);
    expect(ipAllowed('1.2.3.4', null)).toBe(true);
  });

  it('matches exact and CIDR', () => {
    expect(ipAllowed('1.2.3.4', ['1.2.3.4'])).toBe(true);
    expect(ipAllowed('1.2.3.5', ['1.2.3.4'])).toBe(false);
    expect(ipAllowed('203.0.113.10', ['203.0.113.0/24'])).toBe(true);
    expect(ipAllowed('203.0.114.10', ['203.0.113.0/24'])).toBe(false);
  });

  it('parses lists', () => {
    expect(parseIpList('1.1.1.1\n2.2.2.2')).toEqual(['1.1.1.1', '2.2.2.2']);
    expect(parseIpList([' 3.3.3.3 '])).toEqual(['3.3.3.3']);
  });
});
