import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeListComponent } from './code-list.component';

describe('CodeListComponent', () => {
  let component: CodeListComponent;
  let fixture: ComponentFixture<CodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
