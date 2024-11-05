import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorisedDeletionComponent } from './unauthorised-deletion.component';

describe('UnauthorisedDeleteComponent', () => {
  let component: UnauthorisedDeletionComponent;
  let fixture: ComponentFixture<UnauthorisedDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorisedDeletionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorisedDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
