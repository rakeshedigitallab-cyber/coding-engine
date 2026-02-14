import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdCode10Component } from './icd-code10.component';

describe('IcdCode10Component', () => {
  let component: IcdCode10Component;
  let fixture: ComponentFixture<IcdCode10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IcdCode10Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcdCode10Component);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
