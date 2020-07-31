import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfeedComponent } from './addfeed.component';

describe('AddfeedComponent', () => {
  let component: AddfeedComponent;
  let fixture: ComponentFixture<AddfeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
