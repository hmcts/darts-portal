import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryListMessageComponent } from './summary-list-message.component';

describe('SummaryListMessageComponent', () => {
  let component: SummaryListMessageComponent;
  let fixture: ComponentFixture<SummaryListMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryListMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryListMessageComponent);
    fixture.componentRef.setInput('message', 'Example message');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the message', () => {
    expect(fixture.nativeElement.textContent).toContain('Example message');
  });
});
