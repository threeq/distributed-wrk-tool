import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncViewComponent } from './func-view.component';

describe('FuncComponent', () => {
  let component: FuncViewComponent;
  let fixture: ComponentFixture<FuncViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuncViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
