import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointBillingComponent } from './appoint-billing.component';

describe('AppointBillingComponent', () => {
  let component: AppointBillingComponent;
  let fixture: ComponentFixture<AppointBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointBillingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointBillingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
