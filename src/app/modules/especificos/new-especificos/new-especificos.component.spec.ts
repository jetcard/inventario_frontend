import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEspecificosComponent } from './new-especificos.component';

describe('NewEspecificosComponent', () => {
  let component: NewEspecificosComponent;
  let fixture: ComponentFixture<NewEspecificosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEspecificosComponent]
    });
    fixture = TestBed.createComponent(NewEspecificosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});