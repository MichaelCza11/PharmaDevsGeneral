import { TestBed } from '@angular/core/testing';

import { DetalleFacCompraService } from './detalle-fac-compra';

describe('DetalleFacCompra', () => {
  let service: DetalleFacCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleFacCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
