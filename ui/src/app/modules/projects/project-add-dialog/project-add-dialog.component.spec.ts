import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAddDialogComponent } from './project-add-dialog.component';

describe('ProjectAddDialogComponent', () => {
  let component: ProjectAddDialogComponent;
  let fixture: ComponentFixture<ProjectAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
