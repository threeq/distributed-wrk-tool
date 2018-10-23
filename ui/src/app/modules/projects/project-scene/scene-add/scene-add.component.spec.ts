import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneAddComponent } from './scene-add.component';

describe('SceneAddComponent', () => {
  let component: SceneAddComponent;
  let fixture: ComponentFixture<SceneAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
