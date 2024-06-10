import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEspecificoComponent } from './new-especifico.component';

describe('NewEspecificoComponent', () => {
  let component: NewEspecificoComponent;
  let fixture: ComponentFixture<NewEspecificoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEspecificoComponent]
    });
    fixture = TestBed.createComponent(NewEspecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
