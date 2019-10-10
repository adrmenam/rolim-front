import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitMobileComponent } from './visit-mobile.component';

describe('VisitMobileComponent', () => {
  let component: VisitMobileComponent;
  let fixture: ComponentFixture<VisitMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
