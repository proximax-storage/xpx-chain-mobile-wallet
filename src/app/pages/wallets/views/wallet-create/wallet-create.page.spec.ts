import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCreatePage } from './wallet-create.page';

describe('WalletCreatePage', () => {
  let component: WalletCreatePage;
  let fixture: ComponentFixture<WalletCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
