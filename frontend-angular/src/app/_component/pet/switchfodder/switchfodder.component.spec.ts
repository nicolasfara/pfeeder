import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchfodderComponent } from './switchfodder.component';

describe('SwitchfodderComponent', () => {
  let component: SwitchfodderComponent;
  let fixture: ComponentFixture<SwitchfodderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchfodderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchfodderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
