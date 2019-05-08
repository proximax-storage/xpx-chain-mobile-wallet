import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletsPage } from './wallets.page';

describe('WalletsPage', () => {
  let component: WalletsPage;
  let fixture: ComponentFixture<WalletsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
