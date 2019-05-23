import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulationsPage } from './congratulations.page';

describe('CongratulationsPage', () => {
  let component: CongratulationsPage;
  let fixture: ComponentFixture<CongratulationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongratulationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratulationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
