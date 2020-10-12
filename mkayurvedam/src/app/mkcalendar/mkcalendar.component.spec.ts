import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MkcalendarComponent } from './mkcalendar.component';

describe('MkcalendarComponent', () => {
  let component: MkcalendarComponent;
  let fixture: ComponentFixture<MkcalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MkcalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MkcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
