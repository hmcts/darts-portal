import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActiveTabService } from '@services/active-tab/active-tab.service';
import { CaseHearingsTableComponent } from './case-hearings-table.component';

describe('CaseHearingsTableComponent', () => {
  let component: CaseHearingsTableComponent;
  let fixture: ComponentFixture<CaseHearingsTableComponent>;
  let routerSpy: jest.Mocked<Router>;
  let activeTabServiceSpy: jest.Mocked<ActiveTabService>;

  beforeEach(async () => {
    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    activeTabServiceSpy = {
      clearActiveTab: jest.fn(),
    } as unknown as jest.Mocked<ActiveTabService>;

    await TestBed.configureTestingModule({
      imports: [CaseHearingsTableComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActiveTabService, useValue: activeTabServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseHearingsTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
