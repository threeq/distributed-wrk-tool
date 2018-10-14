import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskComponent } from './project-task.component';

describe('ProjectTaskComponent', () => {
  let component: ProjectTaskComponent;
  let fixture: ComponentFixture<ProjectTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
