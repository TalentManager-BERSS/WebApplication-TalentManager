import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSendComponent } from './support-send.component';

describe('SupportSendComponent', () => {
  let component: SupportSendComponent;
  let fixture: ComponentFixture<SupportSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
