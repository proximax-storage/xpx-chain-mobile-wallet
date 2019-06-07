import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccountPage } from './list-account.page';

describe('ListAccountPage', () => {
  let component: ListAccountPage;
  let fixture: ComponentFixture<ListAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
