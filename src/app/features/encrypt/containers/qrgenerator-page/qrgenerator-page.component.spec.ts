import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrgeneratorPageComponent } from './qrgenerator-page.component';

describe('QrgeneratorPageComponent', () => {
  let component: QrgeneratorPageComponent;
  let fixture: ComponentFixture<QrgeneratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrgeneratorPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrgeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
