import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSelection } from './node-selection';

describe('NodeSelection', () => {
  let component: NodeSelection;
  let fixture: ComponentFixture<NodeSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
