import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPwdComponent } from './forget-pwd.component';

describe('ForgetPwdComponent', () => {
  let component: ForgetPwdComponent;
  let fixture: ComponentFixture<ForgetPwdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetPwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
