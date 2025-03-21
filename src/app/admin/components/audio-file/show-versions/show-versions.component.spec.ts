import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShowVersionsComponent } from './show-versions.component';

describe('ShowVersionsComponent', () => {
  let component: ShowVersionsComponent;
  let fixture: ComponentFixture<ShowVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVersionsComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
