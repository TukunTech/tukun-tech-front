import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPatient } from './support-patient';

describe('SupportPatient', () => {
  let component: SupportPatient;
  let fixture: ComponentFixture<SupportPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportPatient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportPatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
