import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptsComponent } from './transcripts.component';

describe('TranscriptsComponent', () => {
  let component: TranscriptsComponent;
  let fixture: ComponentFixture<TranscriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log values on search', () => {
    jest.spyOn(console, 'log');
    component.onSearch({ test: 'test' });
    expect(console.log).toHaveBeenCalledWith({ test: 'test' });
  });
});
