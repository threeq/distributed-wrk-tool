import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMonitorComponent } from './project-monitor.component';

describe('ProjectMonitorComponent', () => {
  let component: ProjectMonitorComponent;
  let fixture: ComponentFixture<ProjectMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
