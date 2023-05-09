import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppInsightsService } from 'src/app/services/app-insights/app-insights.service';
import { SearchComponent } from '../../search/search.component';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    const fakeAppInsightsService = {};

    await TestBed.configureTestingModule({
      imports: [MatIconModule, ReactiveFormsModule],
      declarations: [HeaderComponent, SearchComponent],
      providers: [{ provide: AppInsightsService, useValue: fakeAppInsightsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
