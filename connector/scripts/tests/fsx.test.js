import appRoot from 'app-root-path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import logger from '../logger';
import config from '../config';
import fsx from '../utils/fsx';

chai.use(chaiAsPromised);

global.cfg = config.create();
global.log = logger.start();
global.base = appRoot.path;

describe('fsx', () => {
  describe('isSystemFile()', () => {
    it('should return "true" for ".AppleDB"', () =>
      expect(fsx.isSystemFile('.AppleDB')).to.equal(true),
    );
    it('should return "true" for ".AppleDesktop"', () =>
      expect(fsx.isSystemFile('.AppleDesktop')).to.equal(true),
    );
    it('should return "true" for ".AppleDouble"', () =>
      expect(fsx.isSystemFile('.AppleDouble')).to.equal(true),
    );
    it('should return "true" for ".DocumentRevisions-V100"', () =>
      expect(fsx.isSystemFile('.DocumentRevisions-V100')).to.equal(true),
    );
    it('should return "true" for ".DS_Store"', () =>
      expect(fsx.isSystemFile('.DS_Store')).to.equal(true),
    );
    it('should return "true" for ".DS_Store.ext"', () =>
      expect(fsx.isSystemFile('.DS_Store.ext')).to.equal(true),
    );
    it('should return "true" for ".LSOverride"', () =>
      expect(fsx.isSystemFile('.LSOverride')).to.equal(true),
    );
    it('should return "true" for ".Spotlight-V100"', () =>
      expect(fsx.isSystemFile('.Spotlight-V100')).to.equal(true),
    );
    it('should return "true" for ".Trashes"', () =>
      expect(fsx.isSystemFile('.Trashes')).to.equal(true),
    );
    it('should return "true" for ".VolumeIcon.icns"', () =>
      expect(fsx.isSystemFile('.VolumeIcon.icns')).to.equal(true),
    );
    it('should return "true" for ".apdisk"', () =>
      expect(fsx.isSystemFile('.apdisk')).to.equal(true),
    );
    it('should return "true" for "fseventsd"', () =>
      expect(fsx.isSystemFile('.fseventsd')).to.equal(true),
    );
    it('should return "true" for "Thumbs.db"', () =>
      expect(fsx.isSystemFile('Thumbs.db')).to.equal(true),
    );
    it('should return "true" for "thumbs.db"', () =>
      expect(fsx.isSystemFile('thumbs.db')).to.equal(true),
    );
    it('should return "true" for "ehthumbs.db"', () =>
      expect(fsx.isSystemFile('.ththumbs.db')).to.equal(true),
    );
    it('should return "false" for "shalala.txt"', () =>
      expect(fsx.isSystemFile('shalala.txt')).to.equal(false),
    );
  });
});

describe('fsx', () => {
  describe('uniqueFilenames()', () => {
    it('should return ["./foo/bar", "./foo/baz"] for ["./foo/bar", "./foo/baz", "./bar/baz"]', () =>
      expect(fsx.uniqueFilenames([
        './foo/bar',
        './foo/baz',
        './bar/baz',
      ])).to.deep.equal([
        './foo/bar',
        './foo/baz',
      ]),
    );
    it('should return ["./foo/bar", "./foo/baz"] for ["./foo/bar", "./foo/baz", "./foo/baz"]', () =>
      expect(fsx.uniqueFilenames([
        './foo/bar',
        './foo/baz',
        './foo/baz',
      ])).to.deep.equal([
        './foo/bar',
        './foo/baz',
      ]),
    );
  });
});
