import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCronExpressionComponent } from './edit-cron-expression.component';
import { provideRouter } from '@angular/router';
import { AutomatedTasksService } from '@services/automated-tasks/automated-tasks.service';

describe('EditCronExpressionComponent', () => {
  let component: EditCronExpressionComponent;
  let fixture: ComponentFixture<EditCronExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCronExpressionComponent],
      providers: [
        provideRouter([]),
        {
          provide: AutomatedTasksService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCronExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
