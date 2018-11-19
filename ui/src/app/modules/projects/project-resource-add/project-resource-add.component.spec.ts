import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectResourceAddComponent } from './project-resource-add.component';

describe('ProjectResourceAddComponent', () => {
  let component: ProjectResourceAddComponent;
  let fixture: ComponentFixture<ProjectResourceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectResourceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectResourceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
