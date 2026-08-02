import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionError } from './action-error';

describe('ActionError', () => {
  let component: ActionError;
  let fixture: ComponentFixture<ActionError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionError],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
