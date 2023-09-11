import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HearingFileComponent } from './hearing-file.component';

describe('HearingFileComponent', () => {
  let component: HearingFileComponent;
  let fixture: ComponentFixture<HearingFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HearingFileComponent],
    });
    fixture = TestBed.createComponent(HearingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
