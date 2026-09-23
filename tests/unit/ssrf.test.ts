import { describe, expect, it } from 'vitest';
import {
  isBlockedHostname,
  isBlockedIp,
  parsePublicHttpUrl,
} from '../../src/utils/ssrf';

describe('ssrf guards', () => {
  it('blocks private and metadata IPs', () => {
    expect(isBlockedIp('127.0.0.1')).toBe(true);
    expect(isBlockedIp('10.0.0.5')).toBe(true);
    expect(isBlockedIp('192.168.1.1')).toBe(true);
    expect(isBlockedIp('172.16.0.1')).toBe(true);
    expect(isBlockedIp('169.254.169.254')).toBe(true);
    expect(isBlockedIp('::1')).toBe(true);
    expect(isBlockedIp('::ffff:127.0.0.1')).toBe(true);
    expect(isBlockedIp('8.8.8.8')).toBe(false);
  });

  it('blocks localhost names and non-http schemes', () => {
    expect(isBlockedHostname('localhost')).toBe(true);
    expect(isBlockedHostname('foo.localhost')).toBe(true);
    expect(() => parsePublicHttpUrl('file:///etc/passwd')).toThrow();
    expect(() => parsePublicHttpUrl('http://127.0.0.1/x')).toThrow();
    expect(parsePublicHttpUrl('https://example.com/a.png').hostname).toBe(
      'example.com',
    );
  });
});
