import { ComponentFixture, TestBed } from '@angular/core/testing';

import { marcaComponent } from './marca.component';

describe('marcaComponent', () => {
  let component: marcaComponent;
  let fixture: ComponentFixture<marcaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [marcaComponent]
    });
    fixture = TestBed.createComponent(marcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
