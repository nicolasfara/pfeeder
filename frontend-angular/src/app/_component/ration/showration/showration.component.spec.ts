import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowrationComponent } from './showration.component';

describe('ShowrationComponent', () => {
  let component: ShowrationComponent;
  let fixture: ComponentFixture<ShowrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
