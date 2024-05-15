import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEventMappingComponent } from './add-update-event-mapping.component';

describe('AddUpdateEventMappingComponent', () => {
  let component: AddUpdateEventMappingComponent;
  let fixture: ComponentFixture<AddUpdateEventMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateEventMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateEventMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
