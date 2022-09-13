import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberdashboardComponent } from './memberdashboard.component';

describe('MemberdashboardComponent', () => {
  let component: MemberdashboardComponent;
  let fixture: ComponentFixture<MemberdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
