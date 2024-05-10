import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearChartComponent } from './linear-chart.component';

describe('LinearChartComponent', () => {
  let component: LinearChartComponent;
  let fixture: ComponentFixture<LinearChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinearChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
