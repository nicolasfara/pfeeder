import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrationComponent } from './addration.component';

describe('AddfeedComponent', () => {
  let component: AddrationComponent;
  let fixture: ComponentFixture<AddrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
