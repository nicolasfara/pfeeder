import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfodderComponent } from './addfodder.component';

describe('AddfodderComponent', () => {
  let component: AddfodderComponent;
  let fixture: ComponentFixture<AddfodderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfodderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfodderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
