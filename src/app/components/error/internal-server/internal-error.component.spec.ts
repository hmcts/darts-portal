import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalErrorComponent } from './internal-error.component';

describe('ErrorComponent', () => {
  let component: InternalErrorComponent;
  let fixture: ComponentFixture<InternalErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InternalErrorComponent],
    });
    fixture = TestBed.createComponent(InternalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
