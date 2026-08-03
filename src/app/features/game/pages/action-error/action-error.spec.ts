import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionErrorComponent } from './action-error';

describe('ActionError', () => {
  let component: ActionErrorComponent;
  let fixture: ComponentFixture<ActionErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionErrorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
