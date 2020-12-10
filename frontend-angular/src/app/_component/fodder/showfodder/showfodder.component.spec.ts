import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowfodderComponent } from './showfodder.component';

describe('ShowfodderComponent', () => {
  let component: ShowfodderComponent;
  let fixture: ComponentFixture<ShowfodderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowfodderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowfodderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
