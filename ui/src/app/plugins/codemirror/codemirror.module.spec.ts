import { CodemirrorModule } from './codemirror.module';

describe('CodemirrorModule', () => {
  let codemirrorModule: CodemirrorModule;

  beforeEach(() => {
    codemirrorModule = new CodemirrorModule();
  });

  it('should create an instance', () => {
    expect(codemirrorModule).toBeTruthy();
  });
});
