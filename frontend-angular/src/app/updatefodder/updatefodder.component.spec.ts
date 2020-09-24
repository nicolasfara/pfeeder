import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatefodderComponent } from './updatefodder.component';

describe('UpdatefodderComponent', () => {
  let component: UpdatefodderComponent;
  let fixture: ComponentFixture<UpdatefodderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatefodderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatefodderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
