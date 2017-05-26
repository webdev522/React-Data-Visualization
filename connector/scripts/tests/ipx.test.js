import appRoot from 'app-root-path';
import { expect } from 'chai';
import logger from '../logger';
import config from '../config';
import ipx from '../utils/ipx';

global.cfg = config.create();
global.log = logger.start();
global.base = appRoot.path;

describe('ipx', () => {
  describe('ipx.parsev4()', () => {
    it('should return (0, 0, 255) for ("0.0.0.0", "256")', () =>
      expect(ipx.parsev4('0.0.0.0', '256')).to.deep.equal({
        start: '0',
        end: '255',
        diff: '256',
        // power: 8,
      }),
    );
  });
  describe('ipx.parsev6()', () => {
    it('should return (0, 0, 1) for ("::", "/128")', () =>
      expect(ipx.parsev6('::', '128')).to.deep.equal({
        start: '0',
        end: '0',
        diff: '1',
        // power: 0,
      }),
    );
  });
});
