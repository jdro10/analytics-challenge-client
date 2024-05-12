import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetClassesComponent } from './asset-classes.component';

describe('AssetClassesComponent', () => {
  let component: AssetClassesComponent;
  let fixture: ComponentFixture<AssetClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetClassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
