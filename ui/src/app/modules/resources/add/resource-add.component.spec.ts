import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAddComponent } from './resource-add.component';

describe('ResourceAddComponent', () => {
  let component: ResourceAddComponent;
  let fixture: ComponentFixture<ResourceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
