import { ConfirmModule } from './confirm.module';

describe('ConfirmModule', () => {
  let confirmModule: ConfirmModule;

  beforeEach(() => {
    confirmModule = new ConfirmModule();
  });

  it('should create an instance', () => {
    expect(confirmModule).toBeTruthy();
  });
});
