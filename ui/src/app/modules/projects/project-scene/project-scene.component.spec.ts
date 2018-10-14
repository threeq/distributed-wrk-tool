import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSceneComponent } from './project-scene.component';

describe('ProjectSceneComponent', () => {
  let component: ProjectSceneComponent;
  let fixture: ComponentFixture<ProjectSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
